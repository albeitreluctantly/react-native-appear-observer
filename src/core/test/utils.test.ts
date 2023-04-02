import { getIntersectionPercentage } from '../utils'

describe('utils', () => {
  describe('getIntersectionPercentage', () => {
    const elementSize = 200

    const elementRectangle = {
      top: 0,
      bottom: elementSize,
      left: 0,
      right: elementSize
    }
    const containerRectangle = {
      top: 0,
      bottom: elementSize,
      left: 0,
      right: elementSize
    }

    const elementShiftSteps = [-1, -0.5, 0, 0.5, 1]

    it('should return correct percentage while moving along y axis', () => {
      const intersections = elementShiftSteps.map(value => {
        const shiftStep = elementSize * value

        return getIntersectionPercentage(
          {
            ...elementRectangle,
            top: elementRectangle.top + shiftStep,
            bottom: elementRectangle.bottom + shiftStep
          },
          containerRectangle
        )
      })

      return expect(intersections).toEqual([0, 50, 100, 50, 0])
    })
    it('should return correct percentage while moving along x axis', () => {
      const intersections = elementShiftSteps.map(value => {
        const shiftStep = elementSize * value

        return getIntersectionPercentage(
          {
            ...elementRectangle,
            left: elementRectangle.left + shiftStep,
            right: elementRectangle.right + shiftStep
          },
          containerRectangle
        )
      })

      return expect(intersections).toEqual([0, 50, 100, 50, 0])
    })
    it('should return correct percentage while moving cross axis', () => {
      const intersections = elementShiftSteps.map(value => {
        const shiftStep = elementSize * value

        return getIntersectionPercentage(
          {
            top: elementRectangle.top + shiftStep,
            bottom: elementRectangle.bottom + shiftStep,
            left: elementRectangle.left + shiftStep,
            right: elementRectangle.right + shiftStep
          },
          containerRectangle
        )
      })

      return expect(intersections).toEqual([0, 25, 100, 25, 0])
    })
    it('should apply floating point correction', () => {
      const element = {
        top: -198,
        bottom: 1,
        left: 0,
        right: 200
      }

      expect(getIntersectionPercentage(element, containerRectangle)).toBe(0.502)
    })
  })
})
