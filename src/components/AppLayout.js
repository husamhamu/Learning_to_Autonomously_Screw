import React, {useState, useEffect, useRef} from 'react';

import {Card, Layout} from 'antd';
import FooterCard from './FooterCard';
import { SiderCard } from './SiderCard';
import { HeaderCard } from './HeaderCard';
import { EnvironmentViewer } from './EnvironmentViewer';
import { Socket } from './Socket';
import { ContentCard } from './ContentCard';
import socketIOClient from 'socket.io-client';
const ENDPOINT = 'http://localhost:5000';


const {Header, Content, Sider, Footer} = Layout;


const robotDatabase = {
    "Franka Robotics Panda": "panda_description/urdf/panda.urdf",
    "Universal Robots UR5": "ur_description/urdf/ur5_robot.urdf",
    "Universal Robots UR5 with Gripper": "ur_description/urdf/ur5_gripper.urdf",
    "Universal Robots UR5 with Robotiq 2F-85": "ur_description/urdf/ur5_robotiq_2f_85.urdf",
    "Universal Robots UR10": "ur_description/urdf/ur10_robot.urdf",
    "Unitree A1": "a1_description/urdf/a1.urdf",
    "Unitree H1": "h1_description/urdf/h1.urdf",
    "Unitree H1 with Hand": "h1_description/urdf/h1_with_hand.urdf",
    "Unitree Z1": "z1_description/urdf/z1.urdf",
}

const hardwareDatabase = {
    "Laser Engraving Table": "models/hardware/vention_laser_engraving_table.glb",
    "CNC Lathe Machine Tending": "models/hardware/machine_tending.glb",
    "Pedestal Palletizing": "models/hardware/palletizing.glb",
}


export const AppLayout = () => {

    // localStorage.clear()
    function loadData(key, defaultState) {
        const savedState = localStorage.getItem(key);
        if (savedState) {
            console.log("Loading: ", key, " with saved state: ", savedState)
            return JSON.parse(savedState);

        } 
        console.log("Loading: ", key, " with default state: ", defaultState)
        return defaultState;
    }

    // States 
    const [socketInstance, setSocketInstance] = useState(""); 
    const [robots, setRobots] = useState(() => loadData("robots", []));
    const [hardware, setHardware] = useState(() => loadData("hardware", []));
    const [selectedObject, setSelectedObject] = useState(() => loadData("selectedObject", null));
    const [sceneTreeData, setSceneTreeData] = useState(() => loadData("sceneTreeData", []));
    const [itemTreeData, setItemTreeData] = useState(() => loadData("itemTreeData", {}));
    const [activeTabKey, setActiveTabKey] = useState(() => loadData("activeTabKey", "scene"));
    // const [operationTree, setOperationTree] = useState(() => loadData("operationTree", ['Root']));
    // const [operationTreeData, setOperationTreeData] = useState(() => loadData("operationTreeData",    
    // [{
    //     title: 'Root',
    //     key: 'root',
    //     children: [],
    // },]));
    const [productTreeData, setProductTreeData] = useState(() => loadData("productTreeData", []));

    const [environmentTreeData, setEnvironmentTreeData] = useState([])
    // const [environmentID, setEnvironmentID] = useState(0)
    const environmentID = useRef(0)
    const [transformArrayEnvironment, setTransformArrayEnvironment] = useState([]) 
    const [iterFrame, setIterFrame] = useState(0)
    const [mapFramesID, setMapFramesID] = useState([])
    const mapFramesIDRef = useRef({});
    
    const refsEnvironment = useRef({});
    const pivotControlRef = useRef()

    const [outSocketProductTreeData, setOutSocketProductTreeData] = useState([]);
    const [generateCodeData, setGenerateCodeData] = useState({})
    const [detectorTreeData, setDetectorTreeData] = useState(() => loadData("detectorTreeData", []));
    const [engraverTreeData, setEngraverTreeData] = useState(() => loadData("engraverTreeData", []));
    const [cameraCalibrationTreeData, setCameraCalibrationTreeData] = useState(() => loadData("cameraCalibrationTreeData", []));
    const [templateCreatorTreeData, setTemplateCreatorTreeData] = useState(() => loadData("templateCreatorTreeData", []));
    const [blobArrayProduct, setBlobArrayProduct] = useState([]) 

    const saveSceneRef = useRef(); // Ref for the SaveScene component
    const importSceneRef = useRef(); // Ref for the ImportScene component
    const importRobotRef = useRef();
    const addAssemblyRef = useRef();


    useEffect(() => {
        if(environmentTreeData[Object.keys(environmentTreeData)[Object.keys(environmentTreeData).length-1]]) {
            const environmentID = environmentTreeData[Object.keys(environmentTreeData)[Object.keys(environmentTreeData).length-1]]["id"]
            if (!refsEnvironment.current[environmentID]) {
                refsEnvironment.current[environmentID] = React.createRef();
            }
        }  
    }, [environmentTreeData]) 

    const handleMapFramesID = (frameName, environmentID) => {
        setMapFramesID((prevData) => ({
            ...prevData, // Spread the previous state (existing keys and values)
            [frameName]: environmentID.current // Add or update the frameName with its corresponding value
        }));
        mapFramesIDRef.current = {
            ...mapFramesIDRef.current, // Spread the previous ref value (existing keys and values)
            [frameName]: environmentID.current // Add or update the frameName with its corresponding value
        };
    }
 
    const addFrameToEnvironmentTreeData = (name, environmentID, transform) => {
        const newFrameData = {
            id: environmentID.current, 
            name: name,
            fileURL: null,
            visible: true,
            type: "Frame",
        }  
        setEnvironmentTreeData((prevData) => [...prevData, newFrameData]);

        // Add entry to refsEnvironment
        refsEnvironment.current[environmentID.current] = React.createRef()
 
        // Add entry to transformArrayEnvironment
        const newtransformArrayEnvironment = {id: environmentID.current,
                                            name: name,
                                            transform: transform}
        setTransformArrayEnvironment((prevData) => [...prevData, newtransformArrayEnvironment]);

        // setTransformArrayEnvironment(transformArrayEnvironment.concat(newtransformArrayEnvironment))
           
        // Increment environmentID
        setIterFrame(iterFrame+1)

        const id = environmentID.current
        // TODO
        // This is a hack because Cortex doesn't send the ID, so do this only when not adding the fram from the UI
        if(name.includes("FrameUI") === false) {
        setMapFramesID((prevData) => ({
            ...prevData, // Spread the previous state (existing keys and values)
            [name]: id // Add or update the frameName with its corresponding value
        }));

        mapFramesIDRef.current = {
            ...mapFramesIDRef.current, // Spread the previous ref value (existing keys and values)
            [name]: id // Add or update the frameName with its corresponding value
        };
    }

        environmentID.current = environmentID.current + 1
    } 

    const handelOnAddFrameClick = () => {
        // console.log("ADD FRAME")
        // Add entry to environmentTreeData
        const name = `FrameUI ${iterFrame}`;
        const transform = [0,0,0,0,0,0]
        addFrameToEnvironmentTreeData(name, environmentID, transform)
        socketInstance.emit('ImportToSceneTree', 
            {       fileName: name, 
                    type: "Frame",                                   
                    buffer: null
            });
    
    }

    const [emitedModels, setEmitedModels] = useState(() => loadData("emitedModels", []));

    const handleEmitedModel = (emitedModelData) => {
        // Convert ArrayBuffer to Blob
        const blob = new Blob([emitedModelData["bufferEmited"]]);
        // Create URL for useLoader()
        const url = URL.createObjectURL(blob);
        // Create a dict with URL and other properties, such as fileName
        const emitedModelsDict = {
            fileNameEmited: emitedModelData["fileNameEmited"],
            urlEmitedModel: url,
        }

        // Store the dict in a state, which is used for displaying the models 
        setEmitedModels((prevData) => [...prevData, emitedModelsDict]);
    }

    const handleTemplateCreatorData = (templateCreatorData) => {
        setTemplateCreatorTreeData(prevData => {
            const index = prevData.findIndex(item => item.name === templateCreatorData.name);
            if (index !== -1) {
                // Replace the existing object
                const newData = [...prevData];
                newData[index] = templateCreatorData;
                return newData;
            } else {
                // Append the new object
                return [...prevData, templateCreatorData];
            }
        });
    }
    useEffect(() => {
        console.log("Template Creator Data: ", templateCreatorTreeData)
    }, [templateCreatorTreeData])

    const handleCameraCalibrationTreeData = (cameraCalibrateData) => {
        setDetectorTreeData(prevData => [...prevData, cameraCalibrateData]);
    }

    useEffect(() => {
        console.log("Camera Calibration Tree Data: ", cameraCalibrationTreeData)
    }, [cameraCalibrationTreeData])

    const handleDetectorTreeData = (detectorData) => {
        setDetectorTreeData(prevData => [...prevData, detectorData]);
    }

    useEffect(() => {
        console.log("Detector Tree Data: ", detectorTreeData)
    }, [detectorTreeData])

    const handleEngraverTreeData = (engraverData) => {
        setEngraverTreeData(prevData => {
            const index = prevData.findIndex(item => item.name === engraverData.name);
            if (index !== -1) {
                // Replace the existing object
                const newData = [...prevData];
                newData[index] = engraverData;
                return newData;
            } else {
                // Append the new object
                return [...prevData, engraverData];
            }
        });
    }

    useEffect(() => {
        console.log("Engraver Tree Data: ", engraverTreeData)
    }, [engraverTreeData])


    function handleSelectedObject (object) {
        setSelectedObject(object)
    }

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT, {pingTimeout: 920000, pingInterval:240000});
        setSocketInstance(socket);
  
        socket.on("connect", (data) => {
          console.log(data);
        });
  
        socket.on("disconnect", (data) => {
          console.log(data);
        });
  
        return function cleanup() {
          socket.disconnect();
        };
    }, []);

    useEffect(() => {
    }, [selectedObject])

    function handleGenerateCodeData (data) {
        setGenerateCodeData(data)
    }

    useEffect(() => {
        console.log("Generate code data: ", generateCodeData)
    }, [generateCodeData])

    // function handleOperationTree (node) {
    //     console.log("Setting operation node: ", node)
    //     setOperationTree([...operationTree, node]);
    //     setOperationTreeData([...operationTreeData, {
    //         title: node,
    //         key: `${node}-${operationTreeData.length}`,
    //     }]);
    // }

    // useEffect(() => {
    //     localStorage.setItem('operationTree', JSON.stringify(operationTree))
    // }, [operationTree])

    // useEffect(() => {
    //     localStorage.setItem('operationTreeData', JSON.stringify(operationTreeData))
    // }, [operationTreeData])

    function handleSceneTreeData (event) {

        console.log("Setting sceneTreeData: ", event)
        console.log("Setting sceneTreeData had: ", sceneTreeData);
        // setSceneTreeData(event);
        console.log("Setting sceneTreeData has the result: ", sceneTreeData.concat(event));
        setSceneTreeData(sceneTreeData.concat(event));

    }

    function resetSceneTreeData() {
        console.log("Setting sceneTreeData to empty, before: ", sceneTreeData);
        setSceneTreeData([]);
        console.log("Setting sceneTreeData to empty, after: ", sceneTreeData);

      }

    const handleProductTreeData = (newProductLocalTreeData) => {
        setProductTreeData((prevData) => [...prevData, ...newProductLocalTreeData]);
    };

    const handleEnvironmentTreeData = (newLocalTreeData) => {
        setEnvironmentTreeData((prevData) => [...prevData, ...newLocalTreeData]);
    };

    useEffect(() => {
        if (socketInstance) {  // Ensure socketInstance is not null before calling emit
            socketInstance.emit('ProductTreeData', productTreeData);
            console.log("Sent productTreeData: ", productTreeData);
        }
    }, [productTreeData, socketInstance]);

    useEffect(() => {
        if (socketInstance) {  // Ensure socketInstance is not null before calling emit
            socketInstance.emit('ProductBlob', blobArrayProduct);
            console.log("Sent blobArrayProduct: ", blobArrayProduct);
        }
    }, [blobArrayProduct]); 
 

    const handleOutSocketproductTreeData = (newOutSocketProductTreeData) => {
        setOutSocketProductTreeData((prevData) => [...prevData, ...newOutSocketProductTreeData]);
    }

    // Use useEffect to log the state after it updates
    useEffect(() => {
        console.log("Updated outSocketProductTreeData: ", outSocketProductTreeData);
    }, [outSocketProductTreeData]);

    function handleItemTreeData (event) {
        setItemTreeData(event);
    }

    useEffect(() => {
        localStorage.setItem('itemTreeData', JSON.stringify(itemTreeData))
    }, [itemTreeData])

    function handleActiveTabKey (event) {
        setActiveTabKey(event);
    }

    useEffect(() => {
        localStorage.setItem('activeTabKey', JSON.stringify(activeTabKey))
    }, [activeTabKey])

    function handleAddRobot (values) {        
        setRobots([...robots, values.robotName]);
    }

    useEffect(() => {
        localStorage.setItem('robots', JSON.stringify(robots))
        console.log("Stored robots to localStorage: ", robots)
        console.log("Robot database: ", robotDatabase)
    }, [robots])

    function handleAddHardware (values) {
        setHardware([...hardware, values.hardwareName]);
    } 
    
    useEffect(() => {
        localStorage.setItem('hardware', JSON.stringify(hardware))
    }, [hardware])   
    
    function handleAddFrame (values) {
        console.log("Adding Frame...")
    }

    useEffect(() => {
        localStorage.setItem('sceneTreeData', JSON.stringify(sceneTreeData))
    }, [sceneTreeData])

    return (
        <Layout style={{ height: "100vh"}} >
            <Header style={{padding: '0px 0px 0px 0px'}} >
                <HeaderCard 
                    socketInstance={socketInstance}
                    robotDatabase={robotDatabase}
                    hardwareDatabase={hardwareDatabase}
                    handleAddRobot={handleAddRobot}
                    handleAddHardware={handleAddHardware}
                    handleAddFrame={handleAddFrame}
                    // handleOperationTree={handleOperationTree}
                    saveSceneRef={saveSceneRef}
                    importSceneRef={importSceneRef}
                    importRobotRef={importRobotRef}
                    addAssemblyRef={addAssemblyRef}
                    environmentTreeData={environmentTreeData}
                    handleEnvironmentTreeData={handleEnvironmentTreeData}
                    transformArrayEnvironment={transformArrayEnvironment}
                    setTransformArrayEnvironment={setTransformArrayEnvironment}
                    environmentID={environmentID}
                    handelOnAddFrameClick={handelOnAddFrameClick}
                    />
            </Header>

            <Layout style={{padding: '2px 0px 2px 0px', height: '100%'}} >
                  <Content 
                    style={{
                        display: 'flex',
                        height: '100%',
                        width: '100%',
                    }}>
                        <ContentCard
                            // Data for Code
                            productTreeData={productTreeData}
                            setProductTreeData={setProductTreeData}
                            handleProductTreeData={handleProductTreeData}
                            handleOutSocketproductTreeData={handleOutSocketproductTreeData}
                            handleGenerateCodeData={handleGenerateCodeData}
                            // Data for Logs
                            socketInstance={socketInstance}
                            // Data for Viewer
                            environmentTreeData={environmentTreeData}
                            handleEnvironmentTreeData={handleEnvironmentTreeData}
                            transformArrayEnvironment={transformArrayEnvironment}
                            setTransformArrayEnvironment={setTransformArrayEnvironment}
                            robots={robots}
                            robotDatabase={robotDatabase}
                            handleAddRobot={handleAddRobot}
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
                            pivotControlRef={pivotControlRef}
                            refsEnvironment={refsEnvironment}
                            // Data for Detector
                            detectorTreeData={detectorTreeData}
                            handleDetectorTreeData={handleDetectorTreeData}
                            // Data for Engraver
                            engraverTreeData={engraverTreeData}
                            handleEngraverTreeData={handleEngraverTreeData}
                            // Data for Camera Calibration
                            cameraCalibrationTreeData={cameraCalibrationTreeData}
                            handleCameraCalibrationTreeData={handleCameraCalibrationTreeData}
                            // Data for Template Creator
                            templateCreatorTreeData={templateCreatorTreeData}
                            handleTemplateCreatorTreeData={handleTemplateCreatorData}
                            // Mesh
                            blobArrayProduct={blobArrayProduct}
                            setBlobArrayProduct={setBlobArrayProduct}
                            handleEmitedModel={handleEmitedModel}
                            emitedModels={emitedModels}
                            //
                            addFrameToEnvironmentTreeData={addFrameToEnvironmentTreeData}
                            environmentID={environmentID}
                            mapFramesID={mapFramesID}
                            setMapFramesID={setMapFramesID}
                            handleMapFramesID={handleMapFramesID}
                            mapFramesIDRef={mapFramesIDRef}
                        />
                  </Content>
            </Layout>

            <Footer style={{padding: '0px 0px 0px 0px'}}>
                <FooterCard/>
            </Footer>

            <Socket 
                outSocketProductTreeData={outSocketProductTreeData} 
                handleOutSocketproductTreeData={handleOutSocketproductTreeData} 
                generateCodeData={generateCodeData}
            />
      </Layout>
    );
}