pragma solidity >=0.5.0;

library QuickSortUtils {
    function sort(uint256[] memory data) internal pure returns (uint256[] memory) {
        if (data.length > 1) {
            quickSort(data, 0, data.length - 1);
        }
        return data;
    }

    function quickSort(
        uint256[] memory data,
        uint256 low,
        uint256 high
    ) internal pure {
        if (low < high) {
            uint256 pivotVal = data[(low + high) / 2];

            uint256 low1 = low;
            uint256 high1 = high;
            for (;;) {
                while (data[low1] < pivotVal) low1++;
                while (data[high1] > pivotVal) high1--;
                if (low1 >= high1) break;
                (data[low1], data[high1]) = (data[high1], data[low1]);
                low1++;
                high1--;
            }
            if (low < high1) quickSort(data, low, high1);
            high1++;
            if (high1 < high) quickSort(data, high1, high);
        }
    }
}
