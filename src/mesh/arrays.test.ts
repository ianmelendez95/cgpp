import { deleteIdx } from "./arrays";

describe('Simple1DMesh', () => {
    test('deleteIdx 0', () => {
        testDelete(['a', 'b', 'c'], 0, ['c', 'b']);
    });

    test('deleteIdx 1', () => {
        testDelete(['a', 'b', 'c'], 1, ['a', 'c']);
    });

    test('deleteIdx 2', () => {
        testDelete(['a', 'b', 'c'], 2, ['a', 'b']);
    });

    function testDelete(arr: any[], idx: number, expectedArr: any[]) {
        const testArray = [...arr];
        const deletedValue = deleteIdx(testArray, idx);
        expect(testArray).toEqual(expectedArr);
        expect(deletedValue).toEqual(arr[idx]);
    }
})