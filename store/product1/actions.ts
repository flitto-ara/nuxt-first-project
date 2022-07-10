import { ActionTypes, MutationTypes } from './constants'

// export const actions = {
//   [ActionTypes.LOAD]({ commit }: { commit: Function }) {
//     setTimeout(
//       commit(MutationTypes.UPDATE, { _id: 1, title: 'Product', price: 99.99 }),
//       1000,
//       // mutations[MutationTypes.UPDATE],
//       // { _id: 1, title: 'Product', price: 99.99 },
//     )
//   },
// }

export default {
  [ActionTypes.LOAD]({ commit }: { commit: Function }) {
    console.log('commit?', commit)
    try {
      console.log('heelo?')
      setTimeout(
        commit,
        2000,
        MutationTypes[MutationTypes.UPDATE],
        { _id: 1, title: 'Product2', price: 10.99 },
      )
    } catch (error) {
      console.log('ee')
    }
  },
}
