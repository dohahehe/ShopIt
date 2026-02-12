import { Spinner } from '@/components/ui/spinner'

function Loader() {
  return (
    <div className="w-full min-h-screen bg-linear-to-br from-gray-50 to-white flex flex-col items-center justify-center px-4">
      <div className="relative">
        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-green-500" />
        
        <div className="absolute inset-2 rounded-full animate-pulse opacity-30 " />
        
        {/* Main spinner */}
        <div className="relative p-8 flex flex-col items-center">
          <div className="relative">
            <Spinner className="size-14 text-green-600 animate-spin" />
            <div className="absolute -top-2 -right-2">
              <svg className="w-5 h-5 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="absolute -bottom-2 -left-2">
              <svg className="w-5 h-5 text-emerald-500 animate-bounce delay-150" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          
          <p className="pt-6 text-xl font-semibold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-pulse">
            Loading...
          </p>
          <p className="pt-2 text-sm text-gray-500">
            Please wait a moment
          </p>
          
          
        </div>
      </div>
      
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-linear-to-br from-green-100/30 to-emerald-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-linear-to-br from-emerald-100/30 to-green-100/30 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
              
export default Loader