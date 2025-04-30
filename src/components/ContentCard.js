import React, {useEffect, useState, useRef} from 'react';
import { Button, Card, Flex } from 'antd';
import { LogsEditor } from './LogsEditor';
import { DetectorEditor, DetectorOutliner } from './DetectorEditor';
import {
    DeepLearningDetectorViewer,
    CircleDetectorViewer,
    TemplateMatcherViewer,
    SolvePnPPoseEstimationViewer,
    ClusteredICPPoseEstimationViewer,
} from './DetectorViewer';

import { EnvironmentEditor, EnvironmentOutliner } from './EnvironmentEditor';
import { EnvironmentViewer } from './EnvironmentViewer';
import { EngraverEditor, EngraverOutliner} from './EngraverEditor';
import {EngraverViewer, LaserPeckerViewer} from './EngraverViewer';
import { ProductEditor, ProductOutliner } from './ProductEditor';
import { ProductViewer } from './ProductViewer';
import { LogsViewer } from './LogsViewer';
import { CameraCalibrationViewer } from './CameraCalibrationViewer';
import { CameraCalibrationEditor, CameraCalibrationOutliner } from './CameraCalibrationEditor';
import { TemplateCreatorViewer } from './TemplateCreatorViewer';
import { TemplateCreatorEditor, TemplateCreatorOutliner } from './TemplateCreatorEditor';
import { Euler, Matrix4, Quaternion, Vector3 } from 'three'

import * as THREE from 'three';
import { ArrowsAltOutlined, ExpandAltOutlined, ExpandOutlined, MinusCircleFilled, MinusOutlined, PlusCircleFilled, ShrinkOutlined } from '@ant-design/icons';
import { MinusIcon } from '@heroicons/react/24/solid';
import { element } from 'three/examples/jsm/nodes/Nodes.js';

export const ContentCard = ({
    productTreeData,
    setProductTreeData,
    handleProductTreeData,
    handleOutSocketproductTreeData,
    handleGenerateCodeData,
    socketInstance,
    environmentTreeData,
    handleEnvironmentTreeData,
    robots,
    robotDatabase,
    handleAddRobot,
    hardware,
    hardwareDatabase,
    sceneTreeData,
    handleSceneTreeData,
    resetSceneTreeData,
    selectedObject,
    handleSelectedObject,
    saveSceneRef,
    importSceneRef,
    importRobotRef,
    addAssemblyRef,
    detectorTreeData,
    handleDetectorTreeData,
    engraverTreeData,
    handleEngraverTreeData,
    cameraCalibrationTreeData,
    handleCameraCalibrationTreeData,
    templateCreatorTreeData,
    handleTemplateCreatorTreeData,
    transformArrayEnvironment,
    setTransformArrayEnvironment,
    blobArrayProduct,
    setBlobArrayProduct,
    pivotControlRef,
    refsEnvironment,
    handleEmitedModel,
    emitedModels,
    addFrameToEnvironmentTreeData,
    environmentID,
    mapFramesID,
    setMapFramesID,
    handleMapFramesID,
    mapFramesIDRef
 }) => {
    const [detectorInputImageUrl, setDetectorInputImageUrl] = useState(null);
    const [detectorInputImagesUrls, setDetectorInputImagesUrls] = useState([]);
    const [engraverInputImageUrl, setEngraverInputImageUrl] = useState(null);
    const [showEngraverData, setShowEngraverData] = useState(false);
    const [showDetectorData, setShowDetectorData] = useState(false);
    const [activeOutlinerTabKey, setActiveOutlinerTabKey] = useState('environment');
    const [selectedDetector, setSelectedDetector] = useState('Deep Learning Detector');
    const [selectedEngraver, setSelectedEngraver] = useState('Laser Pecker');
    const [engraverText, setEngraverText] = useState(null);
    const [detectorInputPointCloud, setDetectorInputPointCloud] = useState(null);
    const [viewPcdCenterX, setViewPcdCenterX] = useState(0);
    const [viewPcdCenterY, setViewPcdCenterY] = useState(0);
    const [viewPcdCenterZ, setViewPcdCenterZ] = useState(0);
    const [filterRadius, setFilterRadius] = useState(150);
    const [templateCreatorInputImageUrl, setTemplateCreatorInputInputImageUrl] = useState(null);
    const [templateCreatorOutputImageUrl, setTemplateCreatorOutputImageUrl] = useState(null); 
    const [productViewerCameraPosition, setProductViewerCameraPosition] = useState(new THREE.Vector3(2, -2, 2))
    const [environmentViewerCameraPosition, setEnvironmentViewerCameraPosition] = useState(new THREE.Vector3(2, -2, 2))

    const [checkedKeys, setCheckedKeys] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedItem, setselectedItem] = useState(null);
    const [objString, setObjString] = useState(null);

    const environmentRef = useRef(null);
          
    const [transformArrayProduct, setTransformArrayProduct] = useState([]) 
    const [transformArrayRobot, setTransformArrayRobot] = useState([]) 
    
    const [selectedCodeGenerator, setSelectedCodeGenerator] = useState("LLM Planner");

    const handleSelectedCodeGenerator = (codeGenerator) => {
        setSelectedCodeGenerator(codeGenerator)
    }

    useEffect(() => {
        if (!socketInstance) {
            console.error('socketInstance is not defined');
            return;
        }

        // Event listener
        socketInstance.on('EmitedModel', handleEmitedModel);
        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            socketInstance.off('EmitedModel', handleEmitedModel);
        };

    }, [socketInstance]);

    useEffect(() => {
        // Naive logic for automatically checking all the loaded objects for visualisation
        const newCheckedKeys = productTreeData.map(item => item.key);
        setCheckedKeys(newCheckedKeys)
    }, [productTreeData])

    const handleProductViewerCameraPosition = (data) => { 
        setProductViewerCameraPosition(data)
    } 

    const handleEnvironmentViewerCameraPosition = (data) => { 
        setEnvironmentViewerCameraPosition(data)
    } 

    const handleSelectedProduct = (data) => { 
        setSelectedProduct(data)
    }

    const handleSelectedItem = (data) => { 
        setselectedItem(data)
    }

    const handleTemplateCreatorOutputImageUrl = (inputImageUrl) => {
        setTemplateCreatorOutputImageUrl(inputImageUrl);
    };

    const handleTemplateCreatorInputImageUrl = (inputImageUrl) => {
        setTemplateCreatorInputInputImageUrl(inputImageUrl);
    };


    // Shared states between Editors and Outliners
    const [showTemplateCreatorEditor, setShowTemplateCreatorEditor] = useState(false);

    const handleShowTemplateCreatorEditor = (newShowTemplateCreatorEditor) => {
        console.log("Setting showTemplateCreatorEditor to: ", newShowTemplateCreatorEditor)
        setShowTemplateCreatorEditor(newShowTemplateCreatorEditor);
    }

    useEffect(() => {
        console.log("showTemplateCreatorEditor: ", showTemplateCreatorEditor)
    }, [showTemplateCreatorEditor])

    const [showCameraCalibrationEditor, setShowCameraCalibrationEditor] = useState(false);

    const handleShowCameraCalibrationEditor = (newShowCameraCalibrationEditor) => {
        console.log("Setting showCameraCalibrationEditor to: ", newShowCameraCalibrationEditor)
        setShowCameraCalibrationEditor(newShowCameraCalibrationEditor);
    }

    useEffect(() => {
        console.log("showCameraCalibrationEditor: ", showCameraCalibrationEditor)
    }, [showCameraCalibrationEditor])

    useEffect(() => {
        console.log("Selected Detector: ", selectedDetector)
    },  [selectedDetector])

    const handleSelectedDetector = (selectedDetector) => {
        setSelectedDetector(selectedDetector);
    }

    const handleDetectorInputImageUrl = (inputImageUrl) => {
        setDetectorInputImageUrl(inputImageUrl);
    };

    const handleDetectorInputImagesUrls = (inputImagesUrls, shouldReplace = false) => {
        if (inputImagesUrls === null) {
            setDetectorInputImagesUrls([]);
        } else if (shouldReplace) {
            setDetectorInputImagesUrls(inputImagesUrls);
        } else {
            setDetectorInputImagesUrls(prevImages => [...prevImages, ...inputImagesUrls]);
        }
    };

    const handleDetectorInputPointCloud = (pointCloud) => {
        setDetectorInputPointCloud(pointCloud);
    };

    useEffect(() => {
        console.log('Detector Input Images Urls:', detectorInputImagesUrls);
    }, [detectorInputImagesUrls]);

    useEffect(() => {
        console.log("Selected Engraver: ", selectedEngraver)
    },  [selectedEngraver])

    const handleSelectedEngraver = (selectedEngraver) => {
        setSelectedEngraver(selectedEngraver);
    }

    const handleEngraverInputImageUrl = (inputImageUrl) => {
        setEngraverInputImageUrl(inputImageUrl);
    };

    const handleShowEngraverData = (showEngraverDataFlag) => {
        setShowEngraverData(showEngraverDataFlag);
    }

    const handleEngraverText = (inputEngraverText) => {
        setEngraverText(inputEngraverText);
    }

    const handleShowDetectorData = (showDetectorDataFlag) => {
        setShowDetectorData(showDetectorDataFlag);
    }

    useEffect(() => {
        console.log("Engraver Text: ", engraverText)
    }, [engraverText]);

    const handleActiveOutlinerTabKey = (key) => {
        setActiveOutlinerTabKey(key);
    }; 

    const handelBytes = (data) => {
        const name = data['name'];
        const visible = true;
        const id = environmentID.current;

        if (data['type']=='Mesh') {
            let blob;
            if (name.endsWith(".obj")) {
                blob = new Blob([data['file_data']], { type: "model/obj" });
            }
            else if  (name.endsWith(".glb")) {
                blob = new Blob([data['file_data']], { type: "model/gltf-binary" });
            }
            const fileURL = URL.createObjectURL(blob);

            const newModelLocalTreeData = {
                id: id,
                name: name,
                fileURL: fileURL,
                visible: visible,
                type: "Model",
            }

            const newtransformArrayEnvironment = {
                id: id,
                name: name,
                transform: data['transform']
            }

            // Concat to the existing transformArray state 
            setTransformArrayEnvironment((prevData) => prevData.concat(newtransformArrayEnvironment))

            // Set the newModelLocalTreeData
            handleEnvironmentTreeData([newModelLocalTreeData]);
            environmentID.current = environmentID.current + 1
        }
        else if  (data['type']=='Robot') { 
            console.log("Recieved Robot", name)
        }
        else if  (data['type']=='Frame') { 
            addFrameToEnvironmentTreeData(name, environmentID, data['transform'])
        }
    }; 

    useEffect(() => {
        if (!socketInstance) {
            console.error('socketInstance is not defined');
            return;
        }

        // Event listener
        socketInstance.on('SendBytes', handelBytes);
        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            socketInstance.off('SendBytes', handelBytes);
        };

    }, [socketInstance]);

    const environmentViewer = 
        <EnvironmentViewer
            socketInstance={socketInstance}
            robots={robots}
            handleAddRobot={handleAddRobot}
            robotDatabase={robotDatabase}
            hardware={hardware}
            hardwareDatabase={hardwareDatabase}
            sceneTreeData={sceneTreeData}
            handleSceneTreeData={handleSceneTreeData}
            resetSceneTreeData={resetSceneTreeData}
            selectedObject={selectedObject}
            handleSelectedObject={handleSelectedObject}
            saveSceneRef={saveSceneRef}
            importSceneRef={importSceneRef}
            importRobotRef={importRobotRef}
            addAssemblyRef={addAssemblyRef}
            environmentRef={environmentRef}
            environmentTreeData={environmentTreeData}
            handleEnvironmentTreeData={handleEnvironmentTreeData}
            handleSelectedItem={handleSelectedItem}
            selectedItem={selectedItem}
            transformArrayEnvironment={transformArrayEnvironment}
            setTransformArrayEnvironment={setTransformArrayEnvironment}
            environmentViewerCameraPosition={environmentViewerCameraPosition}
            handleEnvironmentViewerCameraPosition={handleEnvironmentViewerCameraPosition}
            transformArrayRobot={transformArrayRobot}
            setTransformArrayRobot={setTransformArrayRobot}
            pivotControlRef={pivotControlRef}
            refsEnvironment={refsEnvironment}
            addFrameToEnvironmentTreeData={addFrameToEnvironmentTreeData}
            environmentID={environmentID}
            mapFramesID={mapFramesID}
            setMapFramesID={setMapFramesID}
            handleMapFramesID={handleMapFramesID}
            mapFramesIDRef={mapFramesIDRef}
            selectedCodeGenerator={selectedCodeGenerator}
            handleSelectedCodeGenerator={handleSelectedCodeGenerator}
        />

    const outlinerList = {
        environment: <EnvironmentOutliner sceneTreeData={sceneTreeData}/>,
        products: <ProductOutliner 
                        productTreeData={productTreeData} 
                        handleProductTreeData={handleProductTreeData} 
                        checkedKeys={checkedKeys} 
                        setCheckedKeys={setCheckedKeys}
                        transformArrayProduct={transformArrayProduct}
                        setTransformArrayProduct={setTransformArrayProduct}
                        blobArrayProduct={blobArrayProduct}
                        setBlobArrayProduct={setBlobArrayProduct}
                    />,
        // operations: <div/>,
        logs: <div/>,
        detector: <DetectorOutliner
            detectorTreeData={detectorTreeData}
            handleShowDetectorData={handleShowDetectorData}/>,
        engraver: <EngraverOutliner 
            engraverTreeData={engraverTreeData} 
            handleShowEngraverData={handleShowEngraverData}/>,
        calibration: <CameraCalibrationOutliner 
            handleShowCameraCalibrationEditor={handleShowCameraCalibrationEditor}
            cameraCalibrationTreeData={cameraCalibrationTreeData}
            />,
        templateCreator: <TemplateCreatorOutliner 
            handleShowTemplateCreatorEditor={handleShowTemplateCreatorEditor}
            templateCreatorTreeData={templateCreatorTreeData}
        /> 
    }

    const editorList = {
            environment: <EnvironmentEditor
                            selectedObject={selectedObject}
                            environmentRef={environmentRef}
                            socketInstance={socketInstance}
                            productTreeData={productTreeData} 
                            selectedItem={selectedItem}
                            transformArrayEnvironment={transformArrayEnvironment}
                            setTransformArrayEnvironment={setTransformArrayEnvironment}
                            pivotControlRef={pivotControlRef}
                            refsEnvironment={refsEnvironment}
                            environmentTreeData={environmentTreeData}
                        />,
            products:   <ProductEditor 
                            socketInstance={socketInstance}
                            selectedProduct={selectedProduct}
                            transformArrayProduct={transformArrayProduct}
                            setTransformArrayProduct={setTransformArrayProduct}
                        />,
            
            logs: <LogsEditor socketInstance={socketInstance}/>,
            detector:  <DetectorEditor  
                            socketInstance={socketInstance}
                            detectorInputImageUrl={detectorInputImageUrl}
                            detectorInputImagesUrls={detectorInputImagesUrls}
                            // Data for Detector
                            detectorTreeData={detectorTreeData}
                            handleDetectorTreeData={handleDetectorTreeData}
                            selectedDetector={selectedDetector}
                            handleSelectedDetector={handleSelectedDetector}
                            detectorInputPointCloud={detectorInputPointCloud}
                            setViewPcdCenterX={setViewPcdCenterX}
                            setViewPcdCenterY={setViewPcdCenterY}
                            setViewPcdCenterZ={setViewPcdCenterZ}
                            setFilterRadius={setFilterRadius}
                            showDetectorData={showDetectorData}
                            handleShowDetectorData={handleShowDetectorData}
                            productTreeData={productTreeData}
                        />,
            engraver: <EngraverEditor 
                            socketInstance={socketInstance}
                            // Data for Engraver
                            handleEngraverTreeData={handleEngraverTreeData}
                            selectedEngraver={selectedEngraver}
                            handleSelectedEngraver={handleSelectedEngraver}
                            showEngraverData={showEngraverData}
                            handleShowEngraverData={handleShowEngraverData}
                            handleEngraverText={handleEngraverText}/>,
            calibration: <CameraCalibrationEditor
                socketInstance={socketInstance}
                showCameraCalibrationEditor={showCameraCalibrationEditor}
                handleShowCameraCalibrationEditor={handleShowCameraCalibrationEditor} 
                handleCameraCalibrationTreeData={handleCameraCalibrationTreeData} 
                />,
            templateCreator: <TemplateCreatorEditor 
                socketInstance={socketInstance} 
                showTemplateCreatorEditor = {showTemplateCreatorEditor}
                templateCreatorInputImageUrl={templateCreatorInputImageUrl} 
                templateCreatorOutputImageUrl={templateCreatorOutputImageUrl}
                handleShowTemplateCreatorEditor={handleShowTemplateCreatorEditor} 
                handleTemplateCreatorTreeData={handleTemplateCreatorTreeData} />
        }; 

    const viewerList = {
        environment: environmentViewer,
        products: <ProductViewer 
                        socketInstance={socketInstance}
                        productViewerCameraPosition={productViewerCameraPosition} 
                        handleProductViewerCameraPosition={handleProductViewerCameraPosition}  
                        checkedKeys={checkedKeys} 
                        handleSelectedProduct={handleSelectedProduct}
                        productTreeData={productTreeData} 
                        transformArrayProduct={transformArrayProduct}
                        setTransformArrayProduct={setTransformArrayProduct}
                        blobArrayProduct={blobArrayProduct}
                        setBlobArrayProduct={setBlobArrayProduct}
                        objString={objString}
                        setObjString={setObjString}
                        />,
        logs: <LogsViewer 
                socketInstance={socketInstance}
                robots={robots}
                handleAddRobot={handleAddRobot}
                robotDatabase={robotDatabase}
                hardware={hardware}
                hardwareDatabase={hardwareDatabase}
                sceneTreeData={sceneTreeData}
                handleSceneTreeData={handleSceneTreeData}
                resetSceneTreeData={resetSceneTreeData}
                selectedObject={selectedObject}
                handleSelectedObject={handleSelectedObject}
                saveSceneRef={saveSceneRef}
                importSceneRef={importSceneRef}
                importRobotRef={importRobotRef}
                addAssemblyRef={addAssemblyRef}
                environmentRef={environmentRef}
                environmentTreeData={environmentTreeData}
                handleEnvironmentTreeData={handleEnvironmentTreeData}
                handleSelectedItem={handleSelectedItem}
                selectedItem={selectedItem}
                transformArrayEnvironment={transformArrayEnvironment}
                setTransformArrayEnvironment={setTransformArrayEnvironment}
                environmentViewerCameraPosition={environmentViewerCameraPosition}
                handleEnvironmentViewerCameraPosition={handleEnvironmentViewerCameraPosition}
                transformArrayRobot={transformArrayRobot}
                setTransformArrayRobot={setTransformArrayRobot}
                pivotControlRef={pivotControlRef}
                refsEnvironment={refsEnvironment}
                addFrameToEnvironmentTreeData={addFrameToEnvironmentTreeData}
                environmentID={environmentID}
                mapFramesID={mapFramesID}
                setMapFramesID={setMapFramesID}
                handleMapFramesID={handleMapFramesID}
                mapFramesIDRef={mapFramesIDRef}
                />,
        detector: {
            'Deep Learning Detector': <DeepLearningDetectorViewer
                socketInstance={socketInstance}
                handleDetectorInputImageUrl={handleDetectorInputImageUrl}/>,
            'Circle Detector': <CircleDetectorViewer
                socketInstance={socketInstance}
                handleDetectorInputImagesUrls={handleDetectorInputImagesUrls}/>,
            'Template Matcher': <TemplateMatcherViewer
                socketInstance={socketInstance}
                handleDetectorInputImagesUrls={handleDetectorInputImagesUrls}/>,
            'Generalized Template Matcher': <TemplateMatcherViewer
                socketInstance={socketInstance}
                handleDetectorInputImagesUrls={handleDetectorInputImagesUrls}/>,
            'SolvePnP Pose Estimator': <SolvePnPPoseEstimationViewer
                socketInstance={socketInstance}/>,
            'Clustered Sampler ICP Pose Estimator':<ClusteredICPPoseEstimationViewer
                socketInstance={socketInstance}
                handleDetectorInputPointCloud={handleDetectorInputPointCloud}
                viewPcdCenterX={viewPcdCenterX} 
                viewPcdCenterY={viewPcdCenterY}
                viewPcdCenterZ={viewPcdCenterZ}
                filterRadius={filterRadius}/>,
            'Clustered Ffph ICP Pose Estimator':<ClusteredICPPoseEstimationViewer
                socketInstance={socketInstance}
                handleDetectorInputPointCloud={handleDetectorInputPointCloud}
                viewPcdCenterX={viewPcdCenterX} 
                viewPcdCenterY={viewPcdCenterY}
                viewPcdCenterZ={viewPcdCenterZ}
                filterRadius={filterRadius}/>,
            'Clustered Robust ICP Pose Estimator':<ClusteredICPPoseEstimationViewer
                socketInstance={socketInstance}
                handleDetectorInputPointCloud={handleDetectorInputPointCloud}
                viewPcdCenterX={viewPcdCenterX} 
                viewPcdCenterY={viewPcdCenterY}
                viewPcdCenterZ={viewPcdCenterZ}
                filterRadius={filterRadius}/>    
        },
        // engraver: {
        //     'Laser Pecker': <LaserPeckerViewer
        //         socketInstance={socketInstance}
        //         handleEngraverInputImageUrl={handleEngraverInputImageUrl}/>,
        engraver: {
            'Laser Pecker': <EngraverViewer selectedObject={selectedObject}
                                            handleSelectedObject={handleSelectedObject}
                                            engraverText={engraverText}/>,
        },
        calibration: <CameraCalibrationViewer
                        socketInstance={socketInstance}
                        robots={robots}
                        handleAddRobot={handleAddRobot}
                        robotDatabase={robotDatabase}
                        hardware={hardware}
                        hardwareDatabase={hardwareDatabase}
                        sceneTreeData={sceneTreeData}
                        handleSceneTreeData={handleSceneTreeData}
                        resetSceneTreeData={resetSceneTreeData}
                        selectedObject={selectedObject}
                        handleSelectedObject={handleSelectedObject}
                        saveSceneRef={saveSceneRef}
                        importSceneRef={importSceneRef}
                        importRobotRef={importRobotRef}
                        addAssemblyRef={addAssemblyRef}
                        environmentRef={environmentRef}
                        environmentTreeData={environmentTreeData}
                        handleEnvironmentTreeData={handleEnvironmentTreeData}
                        handleSelectedItem={handleSelectedItem}
                        selectedItem={selectedItem}
                        transformArrayEnvironment={transformArrayEnvironment}
                        setTransformArrayEnvironment={setTransformArrayEnvironment}
                        environmentViewerCameraPosition={environmentViewerCameraPosition}
                        handleEnvironmentViewerCameraPosition={handleEnvironmentViewerCameraPosition}
                        transformArrayRobot={transformArrayRobot}
                        setTransformArrayRobot={setTransformArrayRobot}
                        pivotControlRef={pivotControlRef}
                        refsEnvironment={refsEnvironment}
                        addFrameToEnvironmentTreeData={addFrameToEnvironmentTreeData}
                        environmentID={environmentID}
                        mapFramesID={mapFramesID}
                        setMapFramesID={setMapFramesID}
                        handleMapFramesID={handleMapFramesID}
                        mapFramesIDRef={mapFramesIDRef}
        />,
        templateCreator: <TemplateCreatorViewer 
            socketInstance={socketInstance} 
            handleTemplateCreatorInputImageUrl={handleTemplateCreatorInputImageUrl} 
            handleTemplateCreatorOutputImageUrl={handleTemplateCreatorOutputImageUrl}
            environmentViewerCameraPosition={environmentViewerCameraPosition}
            handleEnvironmentViewerCameraPosition={handleEnvironmentViewerCameraPosition}
        />
    };

    const outlinerTabList = [
        {
            key: 'environment',
            label: 'Environment',
        },
        {
            key: 'products',
            label: 'Products',
        },
        // {
        //   key: 'operations',
        //   label: 'Operations',
        // },
        {
          key: 'logs',
          label: 'Logs',
        },
        {
            key: 'detector',
            label: 'Setup Detector',
        },
        {
            key: 'engraver',
            label: 'Setup Engraver',
        },
        {
            key: 'calibration',
            label: 'Setup Camera Calibration',
        },
        {
            key: 'templateCreator',
            label: 'Template Creator',
        },
    ];

    const onOutlinerTabChange = (key) => {
        console.log("----------- Switching content tab to: ", key);
        handleActiveOutlinerTabKey(key);
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '3fr 1fr',
            width: '100%',
            height: '100%',
            overflow: 'auto'
        }}>           
                <div style={{
                        display: 'grid',
                        gridColumn: '1/2',
                        width: '100%',
                        height: '100%',
                        gap: '2px',
                        overflow: 'hidden'
                }}>
                    <div style={{ 
                        gridColumn: '1 / 2', 
                        height: '100%',
                        width: '100%',
                        overflow: 'auto'
                        }}>
                        {activeOutlinerTabKey === 'detector'
                            ? viewerList.detector[selectedDetector]
                            : (activeOutlinerTabKey === 'engraver' 
                                ? viewerList.engraver[selectedEngraver] 
                                : viewerList[activeOutlinerTabKey])}
                    </div>    
                </div>
            <div style={{
                display: 'grid',
                gridTemplateRows: '1fr 2fr',
                gridColumn: '2/2',
                width: '100%',
                height: '100%',
                gap: '2px',
                overflow: 'auto'
            }}>
                <Card
                    tabList={outlinerTabList}
                    tabProps={{ size: 'middle' }}
                    activeTabKey={activeOutlinerTabKey}
                    onTabChange={onOutlinerTabChange}
                    size="small"
                    style={{
                        gridColumn: '2 / 3',
                        gridRow: '1 / 2',
                        height: '100%', // Ensure the card takes the full height of the grid cell
                        overflow: 'auto', // Allow scrolling if content overflows
                    }}
                    body={{
                        paddingRight: 14,
                        paddingLeft: 14,
                        paddingBottom: 14,
                        paddingTop: 8,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {outlinerList[activeOutlinerTabKey]}
                </Card> 
                <Card
                    size="small"
                    style={{
                        gridColumn: '2 / 3',
                        gridRow: '2 / 3',
                        height: '100%', // Ensure the card takes the full height of the grid cell
                        overflow: 'auto', // Allow scrolling if content overflows
                    }}
                    body={{
                        paddingRight: 14,
                        paddingLeft: 14,
                        paddingBottom: 14,
                        paddingTop: 8,
                        height: '100%',
                    }}
                >
                    {editorList[activeOutlinerTabKey]}
                </Card>
            </div>
        </div>
    );
}