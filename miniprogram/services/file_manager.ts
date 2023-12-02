export interface IUploadFileReq {
  cloudPath: string,
  filePath: string,
  config?: {
    env: string
  },
  onCall?: (res: IOnProgressUpdateResp) => boolean
}

export interface IUploadFileResp {
  fileID: string,
  statusCode: number,
  errMsg: string
}

export interface IOnProgressUpdateResp {
  progress: number,
  totalBytesSent: number,
  totalBytesExpectedToSend: number
}

export function upload(req: IUploadFileReq): Promise<ITempFile> {
  return new Promise((resolve, reject) => {
    const task = wx.cloud.uploadFile({
      cloudPath: req.cloudPath,
      filePath: req.filePath,
      success: (res: IUploadFileResp) => {
        getTempFileUrl({
          fileList: [{
            fileID: res.fileID,
            maxAge: 86400
          }]
        }).then((res: IGetTempFileUrlResp) => {
          resolve(res.fileList[0])
        }, () => {
          reject(new Error('【获取临时文件失败】'))
        })
      },
      fail: e => {
        const info = e.toString()
        if (info.indexOf('abort') != -1) {
          reject(new Error('【文件上传失败】中断上传'))
        } else {
          reject(new Error('【文件上传失败】网络或其他错误'))
        }
      }
    })
    task.onProgressUpdate((res: IOnProgressUpdateResp) => {
      if (req.onCall?.(res) == false) {
        task.abort()
      }
    })
  })
}

export interface IGetTempFileUrlReq {
  fileList: Array<{
    fileID: string,
    maxAge?: number
  }>,

  config?: {
    env: string
  }
}

export interface ITempFile {
  fileID: string,
  tempFileURL: string,
  maxAge: number,
  status: number,
  errMsg: string
}

export interface IGetTempFileUrlResp {
  fileList: Array<ITempFile>,
  errMsg: string
}

export function getTempFileUrl(req: IGetTempFileUrlReq): Promise<IGetTempFileUrlResp> {
  return wx.cloud.getTempFileURL({
    // @ts-ignore
    fileList: req.fileList
  })
}