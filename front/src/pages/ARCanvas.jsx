import React, {useEffect, useRef} from "react";
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { Header } from "../components";
import { useLocation } from "react-router-dom";

const ARCanvas = () => {
    const containerRef = useRef();
    const arButtonRef = useRef(null);
    const hitTestSource = useRef(null);
    const hitTestSourceRequested = useRef(false);
    const artworkRef = useRef(null); //중복 생성 방지
    const isDragging = useRef(false);
    const lastTouchY = useRef(null); //터치 시작 시 x,y좌표 저장
    const lastTouchX = useRef(null); 
    const lastTap = useRef(0); //double tap
    //Pinch
    const initalPinchDistance = useRef(null);
    const lastArtworkZ = useRef(0);
    //이미지
    const location = useLocation();
    const querryParams = new URLSearchParams(location.search);
    const image = querryParams.get('image');
    const width = querryParams.get('width');
    const length = querryParams.get('length');


    useEffect(() => {
        //Scene, Camera, Renderer 설정
        const container = containerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
        const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;
        containerRef.current.appendChild(renderer.domElement);

        //AR 버튼 추가(AR 세션 시작 버튼)
        arButtonRef.current = ARButton.createButton(renderer, {requiredFeatures: ['hit-test']});
        containerRef.current.appendChild(arButtonRef.current);
        // document.body.appendChild(arButtonRef.current);
        // document.body.appendChild(ARButton.createButton(renderer, {requiredFeatures: ['hit-test']}))

        //조명 추가
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        //이미지
        const textureLoader = new THREE.TextureLoader();
        const artworkTexture = textureLoader.load(image);
        // //평면 감지를 위한 표적 생성 - 미리보기 레티클
        // let reticle = new THREE.Mesh(
        //     new THREE.PlaneGeometry(0.3, 0.3),
        //     new THREE.MeshBasicMaterial({map: artworkTexture, transparent: true})
        // );
        // reticle.rotation.x = -Math.PI/2;
        // reticle.matrixAutoUpdate = false;
        // reticle.visible = false;
        // scene.add(reticle);

        // 원 레티클
        let reticle = new THREE.Mesh(
            new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
            new THREE.MeshBasicMaterial({color: 0x0f0f0f})
        );
        reticle.matrixAutoUpdate = false;
        reticle.visible = false;
        scene.add(reticle);

        //사용자 선택에 따라 미술 작품 배치 함수
        const createArtwork = (position, rotation) => {
            // 하나의 작품만 생성
            if(artworkRef.current){
                artworkRef.current.position.copy(position);

                //생성시 rotation 정면
                const direction = new THREE.Vector3();
                direction.subVectors(camera.position, artworkRef.current.position).normalize();
                const angleY = Math.atan2(direction.x, direction.z);
                artworkRef.current.rotation.set(0, angleY, 0);
            }else {
                const geometry = new THREE.PlaneGeometry(width,length); //크기 조절
                const material = new THREE.MeshBasicMaterial({ map: artworkTexture, side: THREE.DoubleSide });
                const artwork = new THREE.Mesh(geometry, material);
                artwork.position.copy(position);
                //생성시 rotation 정면
                const direction = new THREE.Vector3();
                direction.subVectors(camera.position, artwork.position).normalize();
                const angleY = Math.atan2(direction.x, direction.z);
                artwork.rotation.set(0, angleY, 0);

                scene.add(artwork);
                artworkRef.current = artwork;
                //생성시 레티클 없애기 - 작동안함...
                reticle.visible = false;
            }
        };

        //y축 조정 함수
        const adjustArtworkYPostion = (deltaY) => {
            if(artworkRef.current){
                const deltaYMovement = deltaY * 0.01;
                artworkRef.current.position.y += deltaYMovement;

                if(artworkRef.current.position.y>3){
                    artworkRef.current.position.y = 3;
                }
                if(artworkRef.current.position.y < -1) {
                    artworkRef.current.position.y = -1;
                }
            }
        };
        //z축 조정 함수
        const adjustArtworkXposition = (deltaX) => {
            if(artworkRef.current){
                const deltaXMovement = deltaX * -0.01;
                artworkRef.current.position.x += deltaXMovement;

                if(artworkRef.current.position.x >3){
                    artworkRef.current.position.x = 3;
                }
                if(artworkRef.current.position.x < -1){
                    artworkRef.current.position.x = -1;
                }
            }
        };
        //Pinch
        const adjustArtworkZPosition = (deltaDistance) => {
            if(artworkRef.current) {
                artworkRef.current.position.z += deltaDistance * 0.002;

                if(artworkRef.current.position.z > 3) {
                    artworkRef.current.position = 3;
                }
                if(artworkRef.current.position.z < -3) {
                    artworkRef.current.position.z = -3;
                }
            }
        };
        
        //터치 시작 이벤트
        const onTouchStart = (event) => {
            isDragging.current = true;

            //Pinch
            if(event.touches.length === 2) {
                const dx = event.touches[0].clientX - event.touches[1].clientX;
                const dy = event.touches[0].clientY - event.touches[1].clientY;
                initalPinchDistance.current = Math.sqrt(dx * dx + dy * dy);
                lastArtworkZ.current = artworkRef.current ? artworkRef.current.position.z : 0 ;
            }
                    
            //터치 시작 시 x,y좌표 저장
            lastTouchY.current = event.touches[0].clientY;
            lastTouchX.current = event.touches[0].clientX;

            //double tap
            const currentTime = new Date().getTime();
            const tapGap = currentTime - lastTap.current;
            if(tapGap < 300 && event.touches.length === 1 && reticle.visible){                
                    const position = new THREE.Vector3();
                    const rotation = new THREE.Quaternion();
                    const scale = new THREE.Vector3();

                    reticle.matrix.decompose(position, rotation, scale);
                    createArtwork(position, rotation);
                }
            lastTap.current = currentTime;                
        };

        //터치 이동 이벤트 (x,y축 조정)
        const onTouchMove = (event) => {
            if(event.touches.length === 2 && initalPinchDistance.current !== null){
                const dx = event.touches[0].clientX - event.touches[1].clientX;
                const dy = event.touches[0].clientY - event.touches[1].clientY;
                const currentPinchDistance = Math.sqrt(dx * dx + dy* dy);

                const deltaDistance = currentPinchDistance - initalPinchDistance.current;
                adjustArtworkZPosition(deltaDistance);

            }
            if(event.touches.length === 1 && isDragging.current && artworkRef.current){
                const touch = event.touches[0];
                const deltaY = lastTouchY.current - touch.clientY;
                const deltaX = lastTouchX.current - touch.clientX;
                adjustArtworkYPostion(deltaY);
                adjustArtworkXposition(deltaX);

                //현재 터치 좌표 업데이트
                lastTouchY.current = touch.clientY;
                lastTouchX.current = touch.clientX;
            }
        };
        //터치 종료 이벤트
        const onTouchEnd = (event) => {
            isDragging.current = false;
            if(event.touches.length < 2) {
                initalPinchDistance.current = null;
            }
        };
        //이벤트 리스너 등록
        window.addEventListener('touchstart', onTouchStart);
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('touchend', onTouchEnd);
        
        // 애니메이션 및 평면 감지
        const animate = () => {
            renderer.setAnimationLoop((timestamp, frame) => {
                if(frame){
                    const session = renderer.xr.getSession();
                    if(!hitTestSourceRequested.current){
                        session.requestReferenceSpace('viewer').then(referenceSpace =>{
                            session.requestHitTestSource({space: referenceSpace}).then(source => {
                                hitTestSource.current = source;
                            }).catch(err => {
                                console.error("Hit test source request failed:", err);
                            });
                        });
                        hitTestSourceRequested.current = true;
                    }

                    const referenceSpace = renderer.xr.getReferenceSpace();
                    if (hitTestSource.current) {
                        const hitTestResults = frame.getHitTestResults(hitTestSource.current);
                        if (hitTestResults.length > 0){
                            const hit = hitTestResults[0];
                            const pose = hit.getPose(referenceSpace);
                            reticle.visible = true;
                            reticle.matrix.fromArray(pose.transform.matrix);
                        } else {
                            reticle.visible = false;
                        }
                    }
                }
                renderer.render(scene, camera);
            });
        };
        
        animate();

        return() => {
            // if(arButtonRef.current){
            //     document.body.removeChild(arButtonRef.current);
            // }
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
            if(container.current){
                container.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [image, width, length]);

    return (
        <div>
            <Header />
            <div ref={containerRef}></div>
        </div>
       
    )
};

export default ARCanvas;