import Image from 'next/image'

export const Heroes = () => {
  return (
    <div className="flex max-w-5xl flex-col items-center justify-center">
      <div className="flex items-center">
        <div className="relative h-[200px] w-[300px] sm:h-[200px] sm:w-[350px] md:h-[200px] md:w-[400px]">
          <Image src="/black-box.png" fill alt="Document" className="object-contain" />
        </div>
        <div className="relative hidden h-[200px] w-[400px] md:block">
          <Image src="/red-box.png" fill alt="Reading" className="object-contain" />
        </div>
      </div>
    </div>
  )
}
