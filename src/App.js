import * as THREE from 'three'
import { useRef, useState } from 'react'
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, ScrollControls, Scroll, useScroll, Preload, Image, MeshTransmissionMaterial, Text, useFBO } from '@react-three/drei'

export default function App() {
  return (
    <Canvas gl={{ antialias: false }} camera={{ position: [0, 0, 20], fov: 17 }}>
      <ScrollControls damping={0.2} maxSpeed={1} pages={3}>
        <Lens>
          <Scroll>
            <Typography />
            <Images />
          </Scroll>
          <Preload />
        </Lens>
      </ScrollControls>
    </Canvas>
  )
}

function Lens({ children, damping = 0.5, ...props }) {
  const { nodes } = useGLTF('/lens-transformed.glb')
  const buffer = useFBO()
  const [scene] = useState(() => new THREE.Scene())
  useFrame((state, delta) => {
    state.gl.setRenderTarget(buffer)
    state.gl.setClearColor('#d8d7d7')
    state.gl.render(scene, state.camera)
    state.gl.setRenderTarget(null)
  })
  return (
    <>
      {createPortal(children, scene)}
      <mesh scale={[2, 2, 1]} position={[0, 0, 15]} rotation={[Math.PI / 2, 0, 0]} geometry={nodes.Cylinder.geometry} {...props}>
        <MeshTransmissionMaterial buffer={buffer.texture} thickness={1} anisotropy={0.2} chromaticAberration={0.01} ior={1.5} />
      </mesh>
    </>
  )
}

function Images() {
  const group = useRef()
  const data = useScroll()
  const { width, height } = useThree((state) => state.viewport)
  useFrame(() => {
    group.current.children[0].material.zoom = 1 + data.range(0, 1 / 3) / 3
    group.current.children[1].material.zoom = 1 + data.range(0, 1 / 3) / 3
    group.current.children[2].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2
    group.current.children[3].material.zoom = 1 + data.range(1.25 / 3, 1 / 3) / 2
    group.current.children[4].material.zoom = 1 + data.range(1.35 / 3, 1 / 3) / 2
    group.current.children[5].material.grayscale = 1 - data.range(1.6 / 3, 1 / 3)
    group.current.children[6].material.zoom = 1 + (1 - data.range(2 / 3, 1 / 3)) / 3
  })
  return (
    <group ref={group}>
      <Image position={[-2, 0, 0]} scale={[4, height, 1]} url="/img1.jpg" />
      <Image position={[2, 0, 3]} scale={3} url="/img6.jpg" />
      <Image position={[-2.05, -height, 6]} scale={[1, 3, 1]} url="/trip2.jpg" />
      <Image position={[-0.6, -height, 9]} scale={[1, 2, 1]} url="/img8.jpg" />
      <Image position={[0.75, -height, 10.5]} scale={1.5} url="/trip4.jpg" />
      <Image position={[0, -height * 1.5, 7.5]} scale={[1.5, 3, 1]} url="/img3.jpg" />
      <Image position={[0, -height * 2 - height / 4, 0]} scale={[width, height / 1.1, 1]} url="/img7.jpg" />
    </group>
  )
}

function Typography() {
  const state = useThree()
  const { width, height } = state.viewport.getCurrentViewport(state.cameta, [0, 0, 12])
  const shared = { font: '/Inter-Regular.woff', letterSpacing: -0.1, color: 'black' }
  return (
    <>
      <Text children="to" anchorX="left" position={[-width / 2.5, -height / 2.8, 12]} {...shared} />
      <Text children="be" anchorX="right" position={[width / 2.5, -height * 2.8, 12]} {...shared} />
      <Text children="home" position={[0, -height * 4.644, 12]} {...shared} />
    </>
  )
}
