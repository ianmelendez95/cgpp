import Simple1DMesh from "./Simple1DMesh"

describe('Simple1DMesh', () => {
    test('deleteIdx', () => {
        expect(Simple1DMesh.deleteIdx(['a', 'b', 'c'], 0)).toEqual(['c', 'b'])
        expect(Simple1DMesh.deleteIdx(['a', 'b', 'c'], 1)).toEqual(['a', 'c'])
        expect(Simple1DMesh.deleteIdx(['a', 'b', 'c'], 2)).toEqual(['a', 'b'])
    })
})