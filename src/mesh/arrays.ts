export type ElemComparable = number;

export function deleteElem<T extends ElemComparable>(arr: T[], elem: T): T {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === elem) {
            return deleteIdx(arr, i);
        }
    }

    throw new Error('Elem not found');
}

export function deleteIdx<T>(arr: T[], idx: number): T {
    if (idx < 0 || idx > arr.length - 1) {
        throw new Error('OOB');
    } else if (idx === arr.length - 1) {
        return arr.pop()!;
    }

    const value = arr[idx];
    arr[idx] = arr.pop()!;
    return value;
}