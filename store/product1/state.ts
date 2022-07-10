import { IProduct, StateTypes } from '~/store/product/type'

export type StateType = {
  [StateTypes.PRODUCT]: IProduct,
}

export default (): StateType => ({
    [StateTypes.PRODUCT]: {
      _id: 0,
      title: 'Unknown',
      price: 0,
    },
  }
)

