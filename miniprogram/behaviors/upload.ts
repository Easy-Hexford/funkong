import * as request from '../services/index'
import type { ITempFile } from '../services/index'
import { genPicName } from '../utils/picture_name'

export interface IChooseImageOption {
  catalog: string,
  varName: string,
}

export interface IPureUploadImageOption {
  catalog: string,
  tempFile: string
}

export type IChooseImageFunc = (opt: IChooseImageOption) => Promise<ITempFile>
export type IPureUploadImageFunc = (opt: IPureUploadImageOption) => Promise<ITempFile>

export interface IUploadBehavior {
  chooseImage: IChooseImageFunc,
  pureUploadImage: IPureUploadImageFunc,
  setData: (args: any, cb?: () => void) => void
}

export const uploadBehavior = Behavior({
  methods: {
    chooseImage(opt: IChooseImageOption): Promise<ITempFile> {
      return new Promise((resolve) => {
        const that = this
        wx.chooseImage({
          count: 1,
          async success(res) {
            // 先展示本地图片
            const tempFile = res.tempFilePaths[0]
            const obj: any = {}
            obj[`${opt.varName}`] = tempFile
            that.setData(obj)

            // 上传云图片获取外网链接
            const cloudPath = genPicName(opt.catalog)
            const resp = await request.uploadFile({
              filePath: tempFile,
              cloudPath: cloudPath
            })

            resolve(resp)
          }
        })
      })
    },

    pureUploadImage(opt: IPureUploadImageOption): Promise<ITempFile> {
      // 上传云图片获取外网链接
      const cloudPath = genPicName(opt.catalog)
      return request.uploadFile({
        filePath: opt.tempFile,
        cloudPath: cloudPath
      })
    }
  }
})
