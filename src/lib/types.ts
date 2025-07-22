export interface TestResults {
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  jitter: number
  videoStreamingSpeed?: number
  socialMediaSpeed?: number
  generalWebSpeed?: number
  testDate: string
}

export interface TestFormData {
  isp: string
  city: string
  downloadSpeed: number
  uploadSpeed: number
  ping: number
  jitter: number
  videoStreamingSpeed?: number
  socialMediaSpeed?: number
  generalWebSpeed?: number
  testDate: string
}

export interface WorkerMessage {
  type: 'progress' | 'complete' | 'error'
  phase?: 'ping' | 'download' | 'upload' | 'services'
  progress?: number
  message?: string
  currentDownload?: number
  currentUpload?: number
  currentPing?: number
  jitter?: number
  results?: TestResults
  action?: 'retry'
  service?: 'youtube' | 'social' | 'web'
  attempt?: number
}
