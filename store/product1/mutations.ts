import { IProduct } from '~/store/product/type'
import { MutationTypes } from './constants'

export default {
  [MutationTypes.UPDATE](state: IProduct, product: IProduct) {
    console.log('여기는 뮤테이션')
    console.log(state)
    console.log(product)
    return Object.assign(state, product)
  },
}
