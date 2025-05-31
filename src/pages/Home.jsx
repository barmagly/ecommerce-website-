import React from 'react'
import Banner from '../components/Banner'
import MainSlider from '../components/MainSlider'
import BestSelling from '../components/BestSelling/bestSelling'
import NewArrival from '../components/NewArrival/NewArrival'
import FeaturesSection from '../components/FeaturesSection/FeaturesSection'


function Home() {
    return (
        <>
            <MainSlider />
            <BestSelling />
            <NewArrival />
            <FeaturesSection />
        </>
    )
}

export default Home