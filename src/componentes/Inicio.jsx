import React from 'react';
import '../App.css';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';


function Inicio() {
  // Carrega o arquivo STL
  const geometry = useLoader(STLLoader, '/espatalho.stl');

  return (

    <div>
        
        <div className='px-4 md:px-8'>
      <h1 className=' font-RedRose  md:pt-56 text-textColor text-4xl md:text-7xl text-center  md:-mt-40'>
       CULTUCANA
      </h1>
        </div>
    <div className="flex justify-center items-center h-screen">
      <Canvas>
        {/* Luzes */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[8, 2, 9]} />

        {/* Controle de órbita */}
       

        {/* Renderizar o modelo STL com centralização e redimensionamento */}
        <mesh 
          geometry={geometry} 
          position={[-1.5, 0.3, 0]}  // Levantar o objeto no eixo Y (0.5 pode ser ajustado)
          scale={[0.01, 0.01, 0.01]}  // Reduzir ainda mais o objeto
          rotation={[-1.3, 0, 0]}  // Rotaciona o objeto 180º no eixo X para desvirá-lo
        >
          <meshStandardMaterial color="white" />
        </mesh>
      </Canvas>
    </div>
    </div>
  );
}

export default Inicio;