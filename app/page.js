import HeroSection from "@/components/hero";
import { Card, CardContent } from "@/components/ui/card";
import { featuresData, howItWorksData } from "@/data/landing";

export default function Home() {
  return (
    <div>
      <div className="mt-40">
        <HeroSection/>
      </div>
      <section className="p-4">
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to manage your finances
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
              gap-6 p-2">
            {
              featuresData.map((feature,index) => (
                <Card key={index} className={"shadow"}>
                  <CardContent className={"space-y-4 pt-4"}>
                    {feature.icon}
                    <h3 className="text-xl font-semibold gradient">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              )) 
            }
          </div>
        </div>
      </section>

      <section className="p-4 my-5">
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
              gap-6 p-2">
            {
              howItWorksData.map((workdata,index) => (
                <Card key={index} className={"shadow"}>
                  <CardContent className={"space-y-4 pt-4"}>
                    {workdata.icon}
                    <h3 className="text-xl font-semibold gradient">{workdata.title}</h3>
                    <p className="text-gray-600">{workdata.description}</p>
                  </CardContent>
                </Card>
              )) 
            }
          </div>
        </div>
      </section>
    </div>

  );
}
