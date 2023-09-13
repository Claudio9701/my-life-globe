import './App.css';
import { FlyToInterpolator } from '@deck.gl/core';
import { useState } from 'react';
import * as Locations from './locations'
import styles from './App.module.css';

import Map from './Map';
import { useSpring, animated } from 'react-spring';

const data = [
    {
        from: {
            name: 'Lima, Peru',
            coordinates: [-77.02824, -12.04318]
        },
        to: {
            name: 'Piura, Peru',
            coordinates: [-80.63282, -5.19449]
        },
        text: "My first job! Using excel and some old software with an\nAccess DB to update inventory in a mechanical motors store 🌞❤️"
    },
    {
        from: {
            name: 'Lima, Peru',
            coordinates: [-77.02824, -12.04318]
        },
        to: {
            name: 'Rio de Janeiro, Brazil',
            coordinates: [-43.18223, -22.90642]
        },
        text: "This was my first time traveling alone and OUT of my country!\nI loved the people at ICA lab.\nPD: I was in Rio during the carnival!"
    },
    {
        from: {
            name: 'Lima, Peru',
            coordinates: [-77.02824, -12.04318]
        },
        to: {
            name: 'Andorra la Vella, Andorra',
            coordinates: [1.601554, 42.546245]
        },
        text: "I visited the Andorra Innovation Lab Actua for a month.\nIt was my first experience in a real-project oriented lab!"
    },
    {
        from: {
            name: 'Lima, Peru',
            coordinates: [-77.02824, -12.04318]
        },
        to: {
            name: 'Paris, France',
            coordinates: [2.3488, 48.85341]
        },
        text: "Current state of the art? 🤔"
    },
]


function App({mapStyle}) {
    const [viewState, setViewState] = useState(Locations.globe);
    const handleChangeViewState = ({ viewState }) => setViewState(viewState);
    const handleFlyTo = destination => {
        setViewState({
            ...viewState,
            ...destination,
            transitionDuration: 5000,
            transitionInterpolator: new FlyToInterpolator(),
         });
    }

    const [arcsEnabled, setArcsEnabled] = useState(true);
    const [springs, api] = useSpring(() => ({
        from: { arcCoef: arcsEnabled ? 0 : 1 },
        to: {
            arcCoef: arcsEnabled ? 1 : 1e-10,
          },
      }))
    const handleToggleArcs = () => {
        setArcsEnabled(!arcsEnabled)
        api.start({
          from: {
            arcCoef: arcsEnabled ? 0 : 1,
          },
          to: {
            arcCoef: arcsEnabled ? 1 : 1e-10,
          },
        })
      };

    const AnimatedMap = animated(Map)

    return (
        <div className="App">
            <AnimatedMap
                data={data}
                viewState={viewState}
                onViewStateChange={handleChangeViewState}
                style={springs}
            />

            <div className={styles.controls}>
            <button onClick={handleToggleArcs}>Start!</button>
             {Object.keys(Locations).map(key => {
                 return <button key={key} onClick={() => handleFlyTo(Locations[key])}>
                 {key}
                 </button>
             })}
            </div>
        </div>
    );
}

export default App;
