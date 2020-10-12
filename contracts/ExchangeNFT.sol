pragma solidity =0.6.6;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/math/SafeMath.sol';
import '@openzeppelin/contracts/math/Math.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721Holder.sol';
import '@openzeppelin/contracts/utils/Pausable.sol';
import '@openzeppelin/contracts/utils/EnumerableSet.sol';
import './libraries/EnumerableMap.sol';

contract ExchangeNFT is ERC721Holder, Ownable, Pausable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using Address for address;
    using EnumerableMap for EnumerableMap.UintToUintMap;
    using EnumerableSet for EnumerableSet.UintSet;

    struct AskEntry {
        uint256 tokenId;
        uint256 price;
    }

    uint256 public MAX_TRADABLE_TOKEN_ID = 10000;
    IERC721 public nft;
    IERC20 public quoteErc20;
    EnumerableMap.UintToUintMap private _asksMap;
    mapping(uint256 => address) private _tokenSellers;
    mapping(address => EnumerableSet.UintSet) private _userSellingTokens;

    event Trade(address indexed seller, address indexed buyer, uint256 indexed tokenId, uint256 price);
    event Ask(address indexed seller, uint256 indexed tokenId, uint256 price);
    event CancelSellToken(address indexed seller, uint256 indexed tokenId);
    event UpdateMaxTradableTokenId(uint256 indexed oldId, uint256 newId);

    constructor(address _nftAddress, address _quoteErc20Address) public {
        require(_nftAddress != address(0) && _nftAddress != address(this));
        require(_quoteErc20Address != address(0) && _quoteErc20Address != address(this));
        nft = IERC721(_nftAddress);
        quoteErc20 = IERC20(_quoteErc20Address);
    }

    function buyToken(uint256 _tokenId) public whenNotPaused {
        require(msg.sender != address(0) && msg.sender != address(this), 'Wrong msg sender');
        require(_asksMap.contains(_tokenId), 'Token not in sell book');
        nft.safeTransferFrom(address(this), msg.sender, _tokenId);
        uint256 price = _asksMap.get(_tokenId);
        quoteErc20.safeTransferFrom(msg.sender, _tokenSellers[_tokenId], price);
        _asksMap.remove(_tokenId);
        _userSellingTokens[_tokenSellers[_tokenId]].remove(_tokenId);
        emit Trade(_tokenSellers[_tokenId], msg.sender, _tokenId, price);
        delete _tokenSellers[_tokenId];
    }

    function setCurrentPrice(uint256 _tokenId, uint256 _price) public whenNotPaused {
        require(_userSellingTokens[msg.sender].contains(_tokenId), 'Only Seller can update price');
        require(_price > 0, 'Price must be granter than zero');
        _asksMap.set(_tokenId, _price);
        emit Ask(msg.sender, _tokenId, _price);
    }

    function readyToSellToken(uint256 _tokenId, uint256 _price) public whenNotPaused {
        require(msg.sender == nft.ownerOf(_tokenId), 'Only Token Owner can sell token');
        require(_price > 0, 'Price must be granter than zero');
        require(_tokenId <= MAX_TRADABLE_TOKEN_ID, 'TokenId must be less than MAX_TRADABLE_TOKEN_ID');
        nft.safeTransferFrom(address(msg.sender), address(this), _tokenId);
        _asksMap.set(_tokenId, _price);
        _tokenSellers[_tokenId] = address(msg.sender);
        _userSellingTokens[msg.sender].add(_tokenId);
        emit Ask(msg.sender, _tokenId, _price);
    }

    function cancelSellToken(uint256 _tokenId) public whenNotPaused {
        require(_userSellingTokens[msg.sender].contains(_tokenId), 'Only Seller can cancel sell token');
        nft.safeTransferFrom(address(this), msg.sender, _tokenId);
        _asksMap.remove(_tokenId);
        _userSellingTokens[_tokenSellers[_tokenId]].remove(_tokenId);
        delete _tokenSellers[_tokenId];
        emit CancelSellToken(msg.sender, _tokenId);
    }

    function getAskLength() public view returns (uint256) {
        return _asksMap.length();
    }

    function getAsks() public view returns (AskEntry[] memory) {
        AskEntry[] memory asks = new AskEntry[](_asksMap.length());
        for (uint256 i = 0; i < _asksMap.length(); ++i) {
            (uint256 tokenId, uint256 price) = _asksMap.at(i);
            asks[i] = AskEntry({tokenId: tokenId, price: price});
        }
        return asks;
    }

    function getAsksDesc() public view returns (AskEntry[] memory) {
        AskEntry[] memory asks = new AskEntry[](_asksMap.length());
        if (_asksMap.length() > 0) {
            for (uint256 i = _asksMap.length() - 1; i > 0; --i) {
                (uint256 tokenId, uint256 price) = _asksMap.at(i);
                asks[_asksMap.length() - 1 - i] = AskEntry({tokenId: tokenId, price: price});
            }
            (uint256 tokenId, uint256 price) = _asksMap.at(0);
            asks[_asksMap.length() - 1] = AskEntry({tokenId: tokenId, price: price});
        }
        return asks;
    }

    function getAsksByPage(uint256 page, uint256 size) public view returns (AskEntry[] memory) {
        if (_asksMap.length() > 0) {
            uint256 from = page == 0 ? 0 : (page - 1) * size;
            uint256 to = Math.min((page == 0 ? 1 : page) * size, _asksMap.length());
            AskEntry[] memory asks = new AskEntry[]((to - from));
            for (uint256 i = 0; from < to; ++i) {
                (uint256 tokenId, uint256 price) = _asksMap.at(from);
                asks[i] = AskEntry({tokenId: tokenId, price: price});
                ++from;
            }
            return asks;
        } else {
            return new AskEntry[](0);
        }
    }

    function getAsksByPageDesc(uint256 page, uint256 size) public view returns (AskEntry[] memory) {
        if (_asksMap.length() > 0) {
            uint256 from = _asksMap.length() - 1 - (page == 0 ? 0 : (page - 1) * size);
            uint256 to = _asksMap.length() - 1 - Math.min((page == 0 ? 1 : page) * size - 1, _asksMap.length() - 1);
            uint256 resultSize = from - to + 1;
            AskEntry[] memory asks = new AskEntry[](resultSize);
            if (to == 0) {
                for (uint256 i = 0; from > to; ++i) {
                    (uint256 tokenId, uint256 price) = _asksMap.at(from);
                    asks[i] = AskEntry({tokenId: tokenId, price: price});
                    --from;
                }
                (uint256 tokenId, uint256 price) = _asksMap.at(0);
                asks[resultSize - 1] = AskEntry({tokenId: tokenId, price: price});
            } else {
                for (uint256 i = 0; from >= to; ++i) {
                    (uint256 tokenId, uint256 price) = _asksMap.at(from);
                    asks[i] = AskEntry({tokenId: tokenId, price: price});
                    --from;
                }
            }
            return asks;
        }
        return new AskEntry[](0);
    }

    function getAsksByUser(address user) public view returns (AskEntry[] memory) {
        AskEntry[] memory asks = new AskEntry[](_userSellingTokens[user].length());
        for (uint256 i = 0; i < _userSellingTokens[user].length(); ++i) {
            uint256 tokenId = _userSellingTokens[user].at(i);
            uint256 price = _asksMap.get(tokenId);
            asks[i] = AskEntry({tokenId: tokenId, price: price});
        }
        return asks;
    }

    function getAsksByUserDesc(address user) public view returns (AskEntry[] memory) {
        AskEntry[] memory asks = new AskEntry[](_userSellingTokens[user].length());
        if (_userSellingTokens[user].length() > 0) {
            for (uint256 i = _userSellingTokens[user].length() - 1; i > 0; --i) {
                uint256 tokenId = _userSellingTokens[user].at(i);
                uint256 price = _asksMap.get(tokenId);
                asks[_userSellingTokens[user].length() - 1 - i] = AskEntry({tokenId: tokenId, price: price});
            }
            uint256 tokenId = _userSellingTokens[user].at(0);
            uint256 price = _asksMap.get(tokenId);
            asks[_userSellingTokens[user].length() - 1] = AskEntry({tokenId: tokenId, price: price});
        }
        return asks;
    }

    function pause() public onlyOwner whenNotPaused {
        _pause();
    }

    function unpause() public onlyOwner whenPaused {
        _unpause();
    }

    function updateMaxTradableTokenId(uint256 _max_tradable_token_id) public onlyOwner {
        emit UpdateMaxTradableTokenId(MAX_TRADABLE_TOKEN_ID, _max_tradable_token_id);
        MAX_TRADABLE_TOKEN_ID = _max_tradable_token_id;
    }
}
