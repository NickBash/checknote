import Image from 'next/image'

export const Heroes = () => {
  return (
    <div className="flex max-w-5xl flex-col items-center justify-center">
      <div className="flex items-center">
        <div className="relative flex gap-28 dark:hidden">
          <Image
            width={512}
            height={512}
            src="/checklist.png"
            alt="Document"
            className="h-[200px] w-[300px] object-contain sm:h-[200px] sm:w-[200px] md:h-[200px] md:w-[200px]"
          />
          <Image
            width={512}
            height={512}
            src="/notebook.png"
            alt="Document"
            className="h-[200px] w-[300px] object-contain sm:h-[200px] sm:w-[200px] md:h-[200px] md:w-[200px]"
          />
          <Image
            width={512}
            height={512}
            src="/connection.png"
            alt="Document"
            className="h-[200px] w-[300px] object-contain sm:h-[200px] sm:w-[200px] md:h-[200px] md:w-[200px]"
          />
        </div>
        <div className="relative hidden gap-28 dark:flex">
          <Image
            width={512}
            height={512}
            src="/checklist-dark.png"
            alt="Document"
            className="h-[200px] w-[300px] object-contain sm:h-[200px] sm:w-[200px] md:h-[200px] md:w-[200px]"
          />
          <Image
            width={512}
            height={512}
            src="/notebook-dark.png"
            alt="Document"
            className="h-[200px] w-[300px] object-contain sm:h-[200px] sm:w-[200px] md:h-[200px] md:w-[200px]"
          />
          <Image
            width={512}
            height={512}
            src="/connection-dark.png"
            alt="Document"
            className="h-[200px] w-[300px] object-contain sm:h-[200px] sm:w-[200px] md:h-[200px] md:w-[200px]"
          />
        </div>
      </div>
    </div>
  )
}
