import { Footer } from './_components/footer'
import { Heading } from './_components/heading'
import { Heroes } from './_components/heroes'

const MarketingPage = ({ params: { lng } }: { params: { lng: string } }) => {
  return (
    <div className="flex min-h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-between gap-y-8 px-6 pb-10 text-center md:justify-between">
        <Heading lng={lng} />
        <Heroes />
        <Footer />
      </div>
    </div>
  )
}

export default MarketingPage