import React, { useMemo } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { WebView } from "react-native-webview";

type SkinId = "silver" | "gold" | "onyx" | "rose" | "cyan" | "purple" | "emerald" | "crimson";
type EyeId  = "blue" | "green" | "red" | "purple" | "orange" | "white";
type SuitId = "none" | "tuxedo" | "space" | "knight" | "ninja" | "lab";
type AccId  = "none" | "tophat" | "cap" | "halo" | "crown" | "glasses" | "shades";
type AntId  = "ball" | "star" | "heart" | "diamond" | "none";
type ExprId = "happy" | "excited" | "cool" | "shy";

interface RobotConfig {
  skin: SkinId; eyes: EyeId; suit: SuitId;
  accessory: AccId; antenna: AntId; expression: ExprId;
}

interface Props {
  config: RobotConfig;
  size?: number;
  style?: ViewStyle;
}

function generateBimoHtml(config: RobotConfig): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background: transparent; overflow: hidden; }
    canvas { width: 100vw; height: 100vh; display: block; touch-action: none; }
  </style>
</head>
<body>
<canvas id="c"></canvas>
<script src="https://unpkg.com/three@0.128.0/build/three.min.js"></script>
<script>
const cfg = ${JSON.stringify(config)};

const SKINS={silver:{body:"#A5ABB6",plate:"#D1D6DE",accent:"#7D8491"},gold:{body:"#C8A84B",plate:"#E8CF7A",accent:"#A08030"},onyx:{body:"#2A2D35",plate:"#3D4150",accent:"#1A1D24"},rose:{body:"#C87B8A",plate:"#E8A0B0",accent:"#A05060"},cyan:{body:"#4A9BAA",plate:"#6ABFCC",accent:"#307A88"},purple:{body:"#7B5AAA",plate:"#9B7ACA",accent:"#5A3A88"},emerald:{body:"#3A9A6A",plate:"#5ABA8A",accent:"#207850"},crimson:{body:"#AA3A4A",plate:"#CA5A6A",accent:"#881828"}};
const EYES={blue:"#00BAFF",green:"#4AE87A",red:"#FF4A4A",purple:"#9A4AE8",orange:"#E8994A",white:"#FFFFFF"};
const SUIT_COLORS={none:null,tuxedo:"#1A1A2E",space:"#1A3A5C",knight:"#3A3A4A",ninja:"#111111",lab:"#F0F0FF"};
const ANT_COLORS={ball:"#00BAFF",star:"#FFD700",heart:"#FF6B8A",diamond:"#A0E8FF",none:null};

let bimo=null,scene,camera,renderer;
let rotY=0,rotX=0,autoRot=true,dragging=false,lastX=0,lastY=0,velX=0;

function mat(color,metalness=0.5,roughness=0.4){return new THREE.MeshStandardMaterial({color,metalness,roughness});}
function mesh(geo,m){return new THREE.Mesh(geo,m);}
function pos(obj,x,y,z){obj.position.set(x,y,z);return obj;}
function rot(obj,x,y,z){obj.rotation.set(x,y,z);return obj;}

function buildBimo(){
  if(bimo)scene.remove(bimo);
  bimo=new THREE.Group();scene.add(bimo);

  const sk=SKINS[cfg.skin]||SKINS.silver;
  const eyeHex=EYES[cfg.eyes]||EYES.blue;
  const suitHex=SUIT_COLORS[cfg.suit];
  const antHex=ANT_COLORS[cfg.antenna];

  const mBody=mat(sk.body,0.5,0.4);
  const mPlate=mat(sk.plate,0.7,0.2);
  const mGlow=new THREE.MeshStandardMaterial({color:eyeHex,emissive:eyeHex,emissiveIntensity:1.5});
  const mSuit=suitHex?mat(suitHex,0.3,0.6):mBody;
  const mAnt=antHex?new THREE.MeshStandardMaterial({color:antHex,emissive:antHex,emissiveIntensity:0.8}):mGlow;
  const mBlack=mat(0x111111,0.1,0.8);
  const mWhite=mat(0xffffff,0.0,0.9);
  const mGold=mat(0xFFD700,0.9,0.1);

  // HEAD
  const headG=new THREE.Group();
  headG.position.y=1.4;bimo.add(headG);
  headG.add(pos(mesh(new THREE.BoxGeometry(2.2,1.7,1.5),mBody),0,0,0));

  [-1.2,1.2].forEach(x=>{
    const ear=pos(rot(mesh(new THREE.CylinderGeometry(0.35,0.35,0.25,32),mBody),0,0,Math.PI/2),x,0,0);
    headG.add(ear);
    const glow=pos(mesh(new THREE.CircleGeometry(0.2,32),mGlow),x>0?0.14:-0.14,0,0);
    glow.rotation.y=x>0?Math.PI/2:-Math.PI/2;
    ear.add(glow);
  });

  [-0.55,0.55].forEach(x=>{
    headG.add(pos(mesh(new THREE.CircleGeometry(0.36,32),mBlack),x,0.1,0.76));
    headG.add(pos(mesh(new THREE.CircleGeometry(0.28,32),mGlow),x,0.1,0.771));
    headG.add(pos(mesh(new THREE.SphereGeometry(0.09,16,16),mWhite),x+0.12,0.22,0.8));
    if(cfg.expression==="cool"){
      headG.add(pos(mesh(new THREE.BoxGeometry(0.6,0.2,0.06),mBlack),x,0.12,0.82));
    }
    if(cfg.expression==="excited"){
      headG.add(pos(mesh(new THREE.RingGeometry(0.28,0.38,32),mGlow),x,0.1,0.775));
    }
  });

  if(cfg.expression!=="shy"){
    const mc=cfg.expression==="excited"?0x4A9EE8:0x333333;
    const mouth=pos(mesh(new THREE.TorusGeometry(0.18,0.05,8,16,Math.PI),mat(mc,0,0.9)),0,cfg.expression==="happy"?-0.38:-0.42,0.76);
    mouth.rotation.x=Math.PI;headG.add(mouth);
    if(cfg.expression==="excited"){
      [-0.1,0,0.1].forEach(tx=>headG.add(pos(mesh(new THREE.BoxGeometry(0.09,0.09,0.04),mWhite),tx,-0.44,0.77)));
    }
  } else {
    const shy=pos(rot(mesh(new THREE.TorusGeometry(0.1,0.04,8,12,Math.PI*0.8),mat(0x888888,0,0.9)),Math.PI*0.9,0,0),0.1,-0.42,0.76);
    headG.add(shy);
    [-0.55,0.55].forEach(x=>headG.add(pos(mesh(new THREE.CircleGeometry(0.15,32),new THREE.MeshStandardMaterial({color:0xff9999,transparent:true,opacity:0.55})),x,-0.05,0.76)));
  }

  // ACCESSORY
  if(cfg.accessory==="tophat"){
    headG.add(pos(mesh(new THREE.CylinderGeometry(1.0,1.0,0.1,32),mBlack),0,0.92,0));
    headG.add(pos(mesh(new THREE.CylinderGeometry(0.65,0.65,0.8,32),mBlack),0,1.35,0));
    headG.add(pos(mesh(new THREE.CylinderGeometry(0.66,0.66,0.15,32),mat(0x882222)),0,0.98,0));
  } else if(cfg.accessory==="crown"){
    headG.add(pos(mesh(new THREE.CylinderGeometry(0.85,0.85,0.2,32),mGold),0,0.96,0));
    for(let i=0;i<5;i++){
      const a=(i/5)*Math.PI*2;
      headG.add(pos(mesh(new THREE.ConeGeometry(0.1,0.35,8),mGold),Math.cos(a)*0.65,1.23,Math.sin(a)*0.65));
    }
  } else if(cfg.accessory==="halo"){
    const halo=pos(mesh(new THREE.TorusGeometry(0.7,0.07,16,64),new THREE.MeshStandardMaterial({color:0xFFFF88,emissive:0xFFFF44,emissiveIntensity:1.0,metalness:0.8})),0,1.1,0);
    halo.rotation.x=0.3;headG.add(halo);
  } else if(cfg.accessory==="cap"){
    headG.add(pos(mesh(new THREE.SphereGeometry(0.85,32,16,0,Math.PI*2,0,Math.PI/2),mat(0x2244AA)),0,0.9,0));
    headG.add(pos(mesh(new THREE.CylinderGeometry(1.05,1.05,0.08,32,1,false,Math.PI*0.1,Math.PI),mat(0x2244AA)),0.15,0.96,0.3));
  } else if(cfg.accessory==="glasses"||cfg.accessory==="shades"){
    const lc=cfg.accessory==="shades"?0x111111:0xaaddff;
    const lo=cfg.accessory==="shades"?0.95:0.45;
    const lmat=new THREE.MeshBasicMaterial({color:lc,transparent:true,opacity:lo});
    [-0.55,0.55].forEach(x=>{
      headG.add(pos(mesh(new THREE.CircleGeometry(0.3,32),lmat),x,0.1,0.79));
      headG.add(pos(mesh(new THREE.RingGeometry(0.28,0.35,32),mat(0x444444,0,0.8)),x,0.1,0.785));
    });
    headG.add(pos(mesh(new THREE.BoxGeometry(0.3,0.06,0.04),mat(0x444444)),0,0.1,0.78));
  }

  // ANTENNA
  if(cfg.antenna!=="none"){
    headG.add(pos(mesh(new THREE.CylinderGeometry(0.055,0.1,0.55),mBody),0,1.05,0));
    const tipG=(cfg.antenna==="star"||cfg.antenna==="diamond")?new THREE.OctahedronGeometry(0.22):new THREE.SphereGeometry(0.2,16,16);
    headG.add(pos(mesh(tipG,mAnt),0,1.38,0));
  }

  // BODY
  bimo.add(pos(mesh(new THREE.BoxGeometry(1.7,1.5,1.3),mSuit),0,0,0));

  if(cfg.suit==="tuxedo"){
    bimo.add(pos(mesh(new THREE.BoxGeometry(0.3,0.8,0.07),mWhite),0,0.1,0.66));
    bimo.add(pos(mesh(new THREE.BoxGeometry(0.28,0.14,0.07),mat(0xAA0000)),0,0.55,0.67));
  } else if(cfg.suit==="lab"){
    [-0.4,0.4].forEach(x=>bimo.add(pos(mesh(new THREE.BoxGeometry(0.35,1.0,0.07),new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:0.85})),x,0,0.67)));
    bimo.add(pos(mesh(new THREE.BoxGeometry(0.28,0.2,0.07),mat(0x3366CC)),-0.45,0.35,0.67));
  } else if(cfg.suit==="space"){
    const ring=pos(mesh(new THREE.TorusGeometry(0.7,0.12,16,32),mat(0xaaaaaa,0.8,0.2)),0,0.82,0);
    ring.rotation.x=Math.PI/2;bimo.add(ring);
    bimo.add(pos(mesh(new THREE.CircleGeometry(0.22,32),new THREE.MeshStandardMaterial({color:0xff8800,emissive:0xff4400,emissiveIntensity:0.5})),0.3,0.2,0.67));
  } else if(cfg.suit==="knight"){
    [-1.0,1.0].forEach(x=>bimo.add(pos(mesh(new THREE.SphereGeometry(0.4,16,16),mat(0x4A4A5A,0.7,0.3)),x,0.5,0)));
    bimo.add(pos(mesh(new THREE.BoxGeometry(0.15,0.5,0.08),mat(0xCC3300)),0,0.3,0.68));
  } else if(cfg.suit==="ninja"){
    bimo.add(pos(mesh(new THREE.BoxGeometry(1.8,0.45,0.08),mBlack),0,-0.1,0.68));
  }

  bimo.add(pos(mesh(new THREE.BoxGeometry(1.1,0.75,0.08),mPlate),0,0.05,0.67));
  [[-0.3,0.15],[0.3,0.15],[0,-0.1]].forEach(([x,y])=>bimo.add(pos(mesh(new THREE.CircleGeometry(0.08,16),mGlow),x,y,0.72)));

  const jt=p=>bimo.add(pos(mesh(new THREE.SphereGeometry(0.07,8,8),mGlow),p.x,p.y,p.z));

  [-1.2,1.2].forEach(x=>{
    const upper=pos(mesh(new THREE.CylinderGeometry(0.18,0.16,0.7),mSuit),x,0.15,0);
    upper.rotation.z=x>0?-0.25:0.25;bimo.add(upper);
    const fore=pos(mesh(new THREE.CylinderGeometry(0.14,0.14,0.55),mBody),x>0?x+0.1:x-0.1,-0.38,0);
    fore.rotation.z=x>0?-0.2:0.2;bimo.add(fore);
    bimo.add(pos(mesh(new THREE.SphereGeometry(0.2,16,16),mBody),x>0?x+0.18:x-0.18,-0.72,0));
    jt(new THREE.Vector3(x>0?x-0.05:x+0.05,0.42,0.35));
  });

  [-0.45,0.45].forEach(x=>{
    bimo.add(pos(mesh(new THREE.CylinderGeometry(0.22,0.2,0.9),mBody),x,-1.25,0));
    bimo.add(pos(mesh(new THREE.SphereGeometry(0.32,16,16,0,Math.PI*2,0,Math.PI/2),mBody),x,-1.72,0.12));
    jt(new THREE.Vector3(x,-0.82,0.32));
  });
}

function init(){
  const canvas=document.getElementById("c");
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(42,window.innerWidth/window.innerHeight,0.1,100);
  camera.position.set(0,0.5,7.5);
  scene.add(new THREE.AmbientLight(0xffffff,0.8));
  const sun=new THREE.DirectionalLight(0xffffff,1.0);
  sun.position.set(5,8,5);scene.add(sun);
  const fill=new THREE.DirectionalLight(0xffffff,0.4);
  fill.position.set(-5,2,-3);scene.add(fill);

  canvas.addEventListener("pointerdown",e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;autoRot=false;velX=0;});
  window.addEventListener("pointerup",()=>dragging=false);
  window.addEventListener("pointermove",e=>{
    if(!dragging)return;
    const dx=e.clientX-lastX,dy=e.clientY-lastY;
    velX=dx*0.015;rotY+=dx*0.015;rotX+=dy*0.01;
    rotX=Math.max(-0.7,Math.min(0.7,rotX));
    lastX=e.clientX;lastY=e.clientY;
  });

  buildBimo();
  animate();
}

let t=0;
function animate(){
  requestAnimationFrame(animate);
  t+=0.016;
  if(!dragging){
    if(autoRot)rotY+=0.008;
    else{velX*=0.95;rotY+=velX;}
  }
  if(bimo){bimo.rotation.y=rotY;bimo.rotation.x=rotX;bimo.position.y=Math.sin(t*1.4)*0.08;}
  renderer.render(scene,camera);
}

if(typeof THREE!=="undefined"){init();}
else{
  const check=setInterval(()=>{
    if(typeof THREE!=="undefined"){clearInterval(check);init();}
  },100);
}
</script>
</body>
</html>`;
}

export function Bimo3D({ config, size = 300, style }: Props) {
  const html = useMemo(() => generateBimoHtml(config), [config]);
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={{ backgroundColor: "transparent" }}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "transparent", overflow: "hidden" },
});