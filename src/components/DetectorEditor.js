import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
    Card,
    Form,
    Input,
    Select,
    InputNumber,
    Collapse,
    Divider,
    Button,
    Flex,
    Checkbox,
    Tooltip,
    Tree, Empty, Typography, Row, Col,
    Space,
} from "antd";
import { 
        DeleteOutlined,
        UploadOutlined, 
        CameraOutlined,
        CaretRightOutlined,
        ScissorOutlined,
        MergeFilled,
        MinusCircleOutlined
} from '@ant-design/icons';
import { PlusOutlined} from '@ant-design/icons';
import 'cropperjs/dist/cropper.css';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'
import { Point } from '@react-three/drei';
import * as THREE from 'three';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const { Option } = Select;
const { Meta } = Card;
const { Search } = Input;


export const SyntheticDataGeneration = ({socketInstance, productTreeData}) => {

    const { Option } = Select;

    // Sample categories
    const categories = [
    { id: 1, name: 'Gear' },
    { id: 2, name: 'Bearing' },
    { id: 3, name: 'Ring' },
    ];


    const [keyLightEnabled, setKeyLightEnabled] = useState(true);
    const [fillLightEnabled, setFillLightEnabled] = useState(true);
    const [backLightEnabled, setBackLightEnabled] = useState(true);
    const [extraLightEnabled, setExtraLightEnabled] = useState(false);
    const [largeDistractorsEnabled, setLargeDistractorsEnabled] = useState(false);
    const [smallDistractorsEnabled, setSmallDistractorsEnabled] = useState(false);
    const [randomFLipEnabled, setrandomFLipEnabled] = useState(false);
    const [planeEnabled, setPlaneEnabled] =useState(false)
    const [textureItemEnabled, setTextureItemEnabled] = useState(false)
    const [hDRIEnabled, setHDRIEnabled] = useState(false)
    const [maxNumInstances, setMaxNumInstances] = useState(3); 
    const [syntheticDataGenerationData, setsyntheticDataGenerationData] = useState(null);
    const [form] = Form.useForm();
    const [selectedObjects, setSelectedObjects] = useState({});

    const handleObjectSelectionChange = (selectedIds) => {
        setSelectedObjects(prevState => {
            const newSelectedObjects = selectedIds.reduce((acc, id) => {
                acc[id] = prevState[id] || {}; // Initialize with empty object
                return acc;
            }, {});
            
            return newSelectedObjects;
        });
    };

    const handleCategoryChange = (objectId, categoryId) => {
        const selectedCategory = categories.find(category => category.id === categoryId);
        setSelectedObjects(prevState => ({
            ...prevState,
            [objectId]: selectedCategory,
        }));
    };
    
    useEffect(() => {
        handleValuesChange({},form.getFieldsValue());
    }, [selectedObjects]);

    const { Panel } = Collapse;

    const handleGenerateSyntheticData = (syntheticDataGenerationData) =>
                {
                // Combine all form values, excluding the dynamically grouped ones
                const combinedValues = {
                    ...syntheticDataGenerationData, // Original form values
                    productsmap: selectedObjects, // Add grouped values
                };
                console.log("Synthetci Data Generation data ", combinedValues) 
                setsyntheticDataGenerationData(combinedValues);
                }

    const handleValuesChange = (changedValues, allValues) => {
        form.validateFields()
        console.log('SyntheticDataGeneration Values:', allValues);
        handleGenerateSyntheticData(allValues);
        console.log('SyntheticDataGeneration data is sent: ', allValues);
    };

    const handleGenerateSyntheticDataclick = (event) => {
        console.log('SyntheticDataGeneration Values:', syntheticDataGenerationData);
        const dataToEmit = [syntheticDataGenerationData];
        socketInstance.emit('GenerateSyntheticData', dataToEmit);
        console.log("save detector trigger sent: ", dataToEmit);
    }

    const handlePreviewSyntheticDataclick = (event) => {
        console.log('SyntheticDataGeneration Values:', syntheticDataGenerationData);
        const dataToEmit = [syntheticDataGenerationData];

        socketInstance.emit('PreviewSyntheticData', dataToEmit);
        console.log("save detector trigger sent: ", dataToEmit);
    }


    if(productTreeData.length !== 0){
        console.log("URL of uploaded product", productTreeData[0].title)
    }

    console.log('NBSAOCBNAOISCNOIASCN')
    const items = [
        {
          key: '1',
          label: 'Synthetic Data Generation',
          children: 
          <Card 
          size="small"
          type="inner"
          bordered 
          style={{ width: '100%' }}
          >
          <Form 
              form={form}
              onValuesChange={handleValuesChange}
              initialValues={{
                keyLightEnabled,
                fillLightEnabled,
                backLightEnabled,
                extraLightEnabled,
                largeDistractorsEnabled,
                smallDistractorsEnabled,
                randomFlip: randomFLipEnabled,
                usePlane: planeEnabled,
                useTextureItem: textureItemEnabled,
                useHDRI: hDRIEnabled
              }}
              layout="horizontal"
              labelCol={{
                span: 12,
              }}
              wrapperCol={{
                span: 32,
              }}
              style={{width: '100%'}}
          >
              <Form.Item label="Dataset Path" name="datasetPath" initialValue={"C:/Repos/cortex/synthetic_data_"}>
                  <Input style={{width: '100%'}} />
              </Form.Item>
              <Form.Item label="Uploaded Product" name="uploadedProduct" initialValue={"uploadedProduct"}>
                  <Input style={{width: '100%'}} />
              </Form.Item>
              <Form.Item label="Image File Format:" name="imageFileFormat" initialValue={"JPEG"}>
                <Select style={{ width: '100%' }}>
                    <Option value="JPEG">JPEG</Option>
                    <Option value="PNG">PNG</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Number of Images" name="numImages" initialValue={1000}>
                  <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              <Divider>Camera</Divider>
              <Form.Item label="Camera Resolution Width" name="cameraResolutionWidth" initialValue={960}>
                  <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              <Form.Item label="Camera Resolution Heigth" name="cameraResolutionHeigth" initialValue={540}>
                  <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              <Form.Item label="Number of Camera Samples per Scene" name="numCameraSamples" initialValue={100}>
                  <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              <Form.Item 
                // tooltip={{ title: 'The camera is constrained to "look at" a point of interest (POI), e.g. the products in the scene.'}} 
                label="Deviation from Camera POI X Minimum" 
                name="poiStdXMin"  
                initialValue={0}>
                <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              < Form.Item label="Y Minimum" name="poiStdYMin" initialValue={0}>
                    <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              < Form.Item label="Z Minimum" name="poiStdZMin" initialValue={0.0}>
                    <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              < Form.Item label="X Maximum" name="poiStdXMax" initialValue={0}>
                    <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              < Form.Item label="Y Maximum" name="poiStdYMax" initialValue={0}>
                    <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              < Form.Item label="Z Maximum" name="poiStdZMax" initialValue={0}>
                    <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              < Form.Item label="Camera Sampler Shell Radius Minimum" name="shellRadiusMin" initialValue={2}>
                    <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              < Form.Item label="Camera Sampler Shell Radius Maximum" name="shellRadiusMax" initialValue={2}>
                    <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              < Form.Item label="Shell Elevation Minimum" name="shellElevationMin" initialValue={-90}>
                    <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              < Form.Item label="Shell Elevation Maximum" name="shellElevationMax" initialValue={90}>
                    <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              < Form.Item label="Camera Sampler Optical Axis Rotation Minimum" name="inplaneRotMin" initialValue={0}>
                    <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              < Form.Item label="Camera Sampler Optical Axis Rotation Maximum" name="inplaneRotMax" initialValue={0}>
                    <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              <Divider>Lights</Divider>
              <Form.Item
                name ="useHDRI"
                valuePropName='checked'>
                <Checkbox checked={hDRIEnabled}
                onChange={(e) => setHDRIEnabled(e.target.checked)}>
                HDRI
                </Checkbox>
                </Form.Item>
              <Divider>Key Light</Divider>
              <Form.Item
                name ="keyLightEnabled"
                valuePropName='checked'>
                <Checkbox checked={keyLightEnabled}
                onChange={(e) => setKeyLightEnabled(e.target.checked)}>
                Key Light
                
                </Checkbox>
                </Form.Item>
                {/* <Form.Item > */}
                <Form
                form={form}
                onValuesChange={handleValuesChange}
                layout="horizontal"
                labelCol={{
                span: 12,
                }}
                wrapperCol={{
                span: 32,
                }}
                disabled={!keyLightEnabled}

                style={{width: '100%'}}
                >
                <Collapse activeKey={keyLightEnabled ? ['1']:[]}>
                <Panel header="Settings" key="1" forceRender>
                    < Form.Item label="Location X Minimum" name="keyLightLocationXMin" initialValue={0} >
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Minimum" name="keyLightLocationYMin" initialValue={0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Minimum" name="keyLightLocationZMin" initialValue={14}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="X Maximum" name="keyLightLocationXMax" initialValue={0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Maximum" name="keyLightLocationYMax" initialValue={0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Maximum" name="keyLightLocationZMax" initialValue={14}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Rotation X Minimum" name="keyLightRotationXMin" initialValue={0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Minimum" name="keyLightRotationYMin" initialValue={0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Minimum" name="keyLightRotationZMin" initialValue={0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="X Maximum" name="keyLightRotationXMax" initialValue={0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Maximum" name="keyLightRotationYMax" initialValue={0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Maximum" name="keyLightRotationZMax" initialValue={0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Energy Minimum" name="keyLightEnergyMin" initialValue={10000}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Energy Maximum" name="keyLightEnergyMax" initialValue={10000}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Spot Size Minimum" name="keyLightSpotSizeMin" initialValue={180}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Spot Size Maximum" name="keyLightSpotSizeMax" initialValue={180}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Blend Size Minimum" name="keyLightBlendSizeMin" initialValue={0.15}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Blend Size Maximum" name="keyLightBlendSizeMax" initialValue={0.15}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Color R Minimum" name="keyLightColorRMin" initialValue={1}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="R Maximum" name="keyLightColorRMax" initialValue={1}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Color G Minimum" name="keyLightColorGMin" initialValue={1}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="G Maximum" name="keyLightColorGMax" initialValue={1.0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Color B Minimum" name="keyLightColorBMin" initialValue={0.9}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="B Maximum" name="keyLightColorBMax" initialValue={0.9}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Shadow Softness" name="keyLightShadowSoftness" initialValue={20}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    </Panel>
                    </Collapse>
                 </Form>
                 {/* </Form.Item> */}
                <Divider>Fill Light</Divider>
                <Form.Item
                name ="fillLightEnabled"
                valuePropName='checked'>
                <Checkbox checked={fillLightEnabled}
                onChange={(e) => setFillLightEnabled(e.target.checked)}>
                        Fill Light
                </Checkbox>     
                </Form.Item>
                <Form.Item>
                <Form
                form={form}
                onValuesChange={handleValuesChange}
                layout="horizontal"
                labelCol={{
                span: 12,
                }}
                wrapperCol={{
                span: 32,
                }}
                disabled={!fillLightEnabled}

                style={{width: '100%'}}
                >
                <Collapse activeKey={fillLightEnabled ? ['1']:[]}>
                <Panel header="Settings" key="1" forceRender>
                    < Form.Item label="Location X Minimum" name="fillLightLocationXMin" initialValue={10}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Minimum" name="fillLightLocationYMin" initialValue={-10}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Minimum" name="fillLightLocationZMin" initialValue={-10}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="X Maximum" name="fillLightLocationXMax" initialValue={10}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Maximum" name="fillLightLocationYMax" initialValue={-10}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Maximum" name="fillLightLocationZMax" initialValue={-10}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Rotation X Minimum" name="fillLightRotationXMin" initialValue={35}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Minimum" name="fillLightRotationYMin" initialValue={135}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Minimum" name="fillLightRotationZMin" initialValue={0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="X Maximum" name="fillLightRotationXMax" initialValue={35}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Maximum" name="fillLightRotationYMax" initialValue={135}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Maximum" name="fillLightRotationZMax" initialValue={0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Energy Minimum" name="fillLightEnergyMin" initialValue={10000}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Energy Maximum" name="fillLightEnergyMax" initialValue={10000}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Spot Size Minimum" name="fillLightSpotSizeMin" initialValue={180}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Spot Size Maximum" name="fillLightSpotSizeMax" initialValue={180}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Blend Size Minimum" name="fillLightBlendSizeMin" initialValue={0.15}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Blend Size Maximum" name="fillLightBlendSizeMax" initialValue={0.15}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Color R Minimum" name="fillLightColorRMin" initialValue={1}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="R Maximum" name="fillLightColorRMax" initialValue={1}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Color G Minimum" name="fillLightColorGMin" initialValue={1}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="G Maximum" name="fillLightColorGMax" initialValue={1.0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Color B Minimum" name="fillLightColorBMin" initialValue={0.9}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="B Maximum" name="fillLightColorBMax" initialValue={0.9}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Shadow Softness" name="fillLightShadowSoftness" initialValue={20}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    </Panel>
                    </Collapse>
                </Form>
                </Form.Item>
                <Divider>Back Light</Divider>
                <Form.Item
                name="backLightEnabled"
                valuePropName="checked"
                >
                <Checkbox checked={backLightEnabled}
                onChange={(e) => setBackLightEnabled(e.target.checked)}>
                Back Light
                </Checkbox>
                </Form.Item>
                <Form.Item>
                <Form
                form={form}
                onValuesChange={handleValuesChange}
                layout="horizontal"
                labelCol={{
                span: 12,
                }}
                wrapperCol={{
                span: 32,
                }}
                disabled={!backLightEnabled}

                style={{width: '100%'}}
                >
                <Collapse activeKey={backLightEnabled ? ['1']:[]}>
                <Panel header="Settings" key="1" forceRender>
                    < Form.Item label="Location X Minimum" name="backLightLocationXMin" initialValue={-10}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Minimum" name="backLightLocationYMin" initialValue={10}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Minimum" name="backLightLocationZMin" initialValue={-10}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="X Maximum" name="backLightLocationXMax" initialValue={-10}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Maximum" name="backLightLocationYMax" initialValue={10}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Maximum" name="backLightLocationZMax" initialValue={-10}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Rotation X Minimum" name="backLightRotationXMin" initialValue={0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Minimum" name="backLightRotationYMin" initialValue={125}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Minimum" name="backLightRotationZMin" initialValue={-135}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="X Maximum" name="backLightRotationXMax" initialValue={0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Maximum" name="backLightRotationYMax" initialValue={125}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Maximum" name="backLightRotationZMax" initialValue={-135}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Energy Minimum" name="backLightEnergyMin" initialValue={10000}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Energy Maximum" name="backLightEnergyMax" initialValue={10000}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Spot Size Minimum" name="backLightSpotSizeMin" initialValue={180}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Spot Size Maximum" name="backLightSpotSizeMax" initialValue={180}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Blend Size Minimum" name="backLightBlendSizeMin" initialValue={0.15}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Blend Size Maximum" name="backLightBlendSizeMax" initialValue={0.15}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Color R Minimum" name="backLightColorRMin" initialValue={1}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="R Maximum" name="backLightColorRMax" initialValue={1}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Color G Minimum" name="backLightColorGMin" initialValue={1}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="G Maximum" name="backLightColorGMax" initialValue={1.0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Color B Minimum" name="backLightColorBMin" initialValue={0.9}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="B Maximum" name="backLightColorBMax" initialValue={0.9}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Schadow Softness" name="backLightShadowSoftness" initialValue={1}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    </Panel>
                    </Collapse>
                </Form>
                </Form.Item>
                <Divider>Extra Light</Divider>
                <Form.Item
                name="extraLightEnabled"
                valuePropName="checked"
                >
                <Checkbox checked={extraLightEnabled}
                onChange={(e) => setExtraLightEnabled(e.target.checked)}>
                Extra Light
                </Checkbox>
                </Form.Item>
                <Form.Item>
                <Form
                form={form}
                onValuesChange={handleValuesChange}
                layout="horizontal"
                labelCol={{
                span: 12,
                }}
                wrapperCol={{
                span: 32,
                }}
                disabled={!extraLightEnabled}

                style={{width: '100%'}}
        >
                <Collapse activeKey={extraLightEnabled ? ['1']:[]}>
                <Panel header="Settings" key="1" forceRender>
                    < Form.Item label="Location X Minimum" name="extraLightLocationXMin" initialValue={-0.01}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Minimum" name="extraLightLocationYMin" initialValue={-0.01}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Minimum" name="extraLightLocationZMin" initialValue={1.99}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="X Maximum" name="extraLightLocationXMax" initialValue={0.0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Maximum" name="extraLightLocationYMax" initialValue={0.0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Maximum" name="extraLightLocationZMax" initialValue={2.0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Rotation X Minimum" name="extraLightRotationXMin" initialValue={-1.0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Minimum" name="extraLightRotationYMin" initialValue={-1.0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Minimum" name="extraLightRotationZMin" initialValue={-1.0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="X Maximum" name="extraLightRotationXMax" initialValue={0.0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Maximum" name="extraLightRotationYMax" initialValue={0.0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Maximum" name="extraLightRotationZMax" initialValue={0.0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Energy Minimum" name="extraLightEnergyMin" initialValue={1}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Energy Maximum" name="extraLightEnergyMax" initialValue={300}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Color R Minimum" name="extraLightColorRMin" initialValue={0.9}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="R Maximum" name="extraLightColorRMax" initialValue={1}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Color G Minimum" name="extraLightColorGMin" initialValue={0.9}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="G Maximum" name="extraLightColorGMax" initialValue={1.0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Color B Minimum" name="extraLightColorBMin" initialValue={0.9}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="B Maximum" name="extraLightColorBMax" initialValue={1.0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    </Panel>
                    </Collapse>
                </Form>
                </Form.Item>
            <Divider>Products</Divider>
                    <Form.Item
                        name="products"
                        label="Select Objects"
                    >
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select objects"
                        onChange={handleObjectSelectionChange}
                        value={Object.keys(selectedObjects)}
                    >   
                        console.log('productTreeData:', productTreeData);
                        {productTreeData.map(product => ( 
                        <Option key={product.name} value={product.name}>
                            {product.name}
                        </Option>
                        ))}
                    </Select>
                    </Form.Item>
                            
                {Object.keys(selectedObjects).map(objectId => (
                    <Form.Item
                    label={objectId}
                    >
                            <Select
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Select a category"
                                onChange={(value) => handleCategoryChange(objectId, value)}
                                value={selectedObjects[objectId]?.id} // Ensure the correct category ID is selected
                            >
                                {categories.map(category => (
                                    <Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                                
                    </Form.Item>
                ))}

            < Form.Item label="Maximum Number of Instances per Category" name="maxNumInstancesPerCategory" initialValue={maxNumInstances}>
                            <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            < Form.Item label="Minimum Number of Instances in Scene" name="minNumInstancesPerScene" initialValue={maxNumInstances*Object.keys(selectedObjects).length}
                rules={[
                        ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (value <= getFieldValue('maxNumInstancesPerScene')) {
                                        if (value <= getFieldValue('maxNumInstancesPerCategory')*Object.keys(selectedObjects).length){
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error(`Minimum number of instances must be at maximum ${maxNumInstances*Object.keys(selectedObjects).length}`)
                                            )
                                  }
                                  return Promise.reject(
                                    new Error('Minimum number of instances cannot exceed the maximum number')
                                  );
                                },
                              }),
                        ]}
                        >
                <InputNumber style={{ width: '100%' }} max={maxNumInstances*Object.keys(selectedObjects).length} />
            </Form.Item>
            < Form.Item label="Maximum Number of Instances in Scene" name="maxNumInstancesPerScene" initialValue={maxNumInstances*Object.keys(selectedObjects).length}
            rules={[
                        ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (value >= getFieldValue('minNumInstancesPerScene')) {
                                    if (value <= getFieldValue('maxNumInstancesPerCategory')*Object.keys(selectedObjects).length){
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(`Maximum number of instances must be at maximum ${maxNumInstances*Object.keys(selectedObjects).length}`)
                                    )
                                  }
                                  return Promise.reject(
                                    new Error('Maximum number of instances must be at least the minimum number')
                                  );
                                },
                              }),
                        ]
                }
                        >
                <InputNumber style={{ width: '100%' }} max={maxNumInstances*Object.keys(selectedObjects)} />
            </Form.Item>
            < Form.Item label="Sample Location X Minimum" name="objSampleLocXMin" initialValue={-0.12}>
                            <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            < Form.Item label="Y Minimum" name="objSampleLocYMin" initialValue={-0.12}>
                    <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            < Form.Item label="Z Minimum" name="objSampleLocZMin" initialValue={0.001}>
                    <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            < Form.Item label="X Maximum" name="objSampleLocXMax" initialValue={0.12}>
                    <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            < Form.Item label="Y Maximum" name="objSampleLocYMax" initialValue={0.12}>
                    <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            < Form.Item label="Z Maximum" name="objSampleLocZMax" initialValue={0.001}>
                    <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            < Form.Item label="Sample Rotation X Minimum" name="objSampleRotXMin" initialValue={-90}>
                    <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            < Form.Item label="Y Minimum" name="objSampleRotYMin" initialValue={0}>
                    <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            < Form.Item label="Z Minimum" name="objSampleRotZMin" initialValue={0}>
                    <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            < Form.Item label="X Maximum" name="objSampleRotXMax" initialValue={-90}>
                    <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            < Form.Item label="Y Maximum" name="objSampleRotYMax" initialValue={0}>
                    <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            < Form.Item label="Z Maximum" name="objSampleRotZMax" initialValue={0}>
                    <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            <Form.Item
                name="randomFlip"
                valuePropName="checked"
                >
                <Checkbox checked={randomFLipEnabled}
                onChange={(e) => setrandomFLipEnabled(e.target.checked)}>
                Random Flip
                </Checkbox>
            </Form.Item>
            < Form.Item label="Maximum Sample Tries" name="objSampleMaxTries" initialValue={10000}>
                    <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            < Form.Item label="Scale UV Coordinates" name="scaleUvCoordinatesItem" initialValue={0.5}>
                    <InputNumber style={{width: '100%'}}/>
            </Form.Item>
            <Form.Item
                name="useTextureItem"
                valuePropName="checked"
                >
                <Checkbox checked={textureItemEnabled}
                        onChange={(e) => setTextureItemEnabled(e.target.checked)}>
                Texture Item
                </Checkbox>
            </Form.Item>
                <Divider>Plane</Divider>
        <Form.Item
                name="usePlane"
                valuePropName="checked"
                >
                <Checkbox checked={planeEnabled}
                        onChange={(e) => setPlaneEnabled(e.target.checked)}>
                Plane
                </Checkbox>
        </Form.Item>
            <Divider>Large Distractors</Divider>
        <Form.Item
        name="largeDistractorsEnabled"
        valuePropName="checked"
        >
        <Checkbox checked={largeDistractorsEnabled}
                onChange={(e) => setLargeDistractorsEnabled(e.target.checked)}>
        Large Distractors
        </Checkbox>
        </Form.Item>
        <Form.Item>
                <Form
                form={form}
                onValuesChange={handleValuesChange}
                layout="horizontal"
                labelCol={{
                span: 12,
                }}
                wrapperCol={{
                span: 32,
                }}
                disabled={!largeDistractorsEnabled}

                style={{width: '100%'}}
                >
                <Collapse activeKey={largeDistractorsEnabled ? ['1']:[]}>
                <Panel header="Settings" key="1" forceRender>
                    < Form.Item label="Maximum Number of Instances per Distractor" name="maxNumInstancesPerLargeDistractor" initialValue={3}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Minimum Number of Distractors" name="minNumLargeDistractorsInScene" initialValue={5}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Sample Location X Minimum" name="largeDistractorSampleLocXMin" initialValue={-0.3}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Minimum" name="largeDistractorSampleLocYMin" initialValue={-0.3}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Minimum" name="largeDistractorSampleLocZMin" initialValue={-0.05}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="X Maximum" name="largeDistractorSampleLocXMax" initialValue={0.3}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Maximum" name="largeDistractorSampleLocYMax" initialValue={0.3}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Maximum" name="largeDistractorSampleLocZMax" initialValue={-0.007}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Sample Rotation X Minimum" name="largeDistractorSampleRotXMin" initialValue={89}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Minimum" name="largeDistractorSampleRotYMin" initialValue={-1}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Minimum" name="largeDistractorSampleRotZMin" initialValue={-1}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="X Maximum" name="largeDistractorSampleRotXMax" initialValue={90}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Maximum" name="largeDistractorSampleRotYMax" initialValue={0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Maximum" name="largeDistractorSampleRotZMax" initialValue={0}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Maximum Sample Tries" name="largeDistractorSampleMaxTries" initialValue={10000}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Scale UV Coordinates" name="scaleUvCoordinatesLargeDistractor" initialValue={10}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    </Panel>
                    </Collapse>
                </Form>
                </Form.Item>
                <Divider>Small Distractors</Divider>
                <Form.Item
                name="smallDistractorsEnabled"
                valuePropName="checked"
                >
                <Checkbox checked={smallDistractorsEnabled}
                onChange={(e) => setSmallDistractorsEnabled(e.target.checked)}>
                Small Distractors
                </Checkbox>
                </Form.Item>
                <Form.Item>
                <Form
                form={form}
                onValuesChange={handleValuesChange}
                layout="horizontal"
                labelCol={{
                span: 12,
                }}
                wrapperCol={{
                span: 32,
                }}
                disabled={!smallDistractorsEnabled}

                style={{width: '100%'}}
                > 
                <Collapse activeKey={smallDistractorsEnabled ? ['1']:[]}>
                <Panel header="Settings" key="1" forceRender>
                    < Form.Item label="Maximum Number of Instances per Distractor" name="maxNumInstancesPerSmallDistractor" initialValue={2}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Minimum Number of Distractors" name="minNumSmallDistractorsInScene" initialValue={10}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Sample Location X Minimum" name="smallDistractorSampleLocXMin" initialValue={-0.15}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Minimum" name="smallDistractorSampleLocYMin" initialValue={-0.15}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Minimum" name="smallDistractorSampleLocZMin" initialValue={-0.1}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="X Maximum" name="smallDistractorSampleLocXMax" initialValue={0.15}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Maximum" name="smallDistractorSampleLocYMax" initialValue={0.15}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Maximum" name="smallDistractorSampleLocZMax" initialValue={0.2}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Sample Rotation X Minimum" name="smallDistractorSampleRotXMin" initialValue={-90}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Minimum" name="smallDistractorSampleRotYMin" initialValue={-90}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Minimum" name="smallDistractorSampleRotZMin" initialValue={-90}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="X Maximum" name="smallDistractorSampleRotXMax" initialValue={90}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Y Maximum" name="smallDistractorSampleRotYMax" initialValue={90}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Z Maximum" name="smallDistractorSampleRotZMax" initialValue={90}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Maximum Sample Tries" name="smallDistractorSampleMaxTries" initialValue={10000}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    < Form.Item label="Scale UV Coordinates" name="scaleUvCoordinatesSmallDistractor" initialValue={0.5}>
                            <InputNumber style={{width: '100%'}}/>
                    </Form.Item>
                    </Panel>
                    </Collapse>
                </Form>
                </Form.Item>
                <Divider>Background</Divider>
                < Form.Item label="Scale UV Coordinates CC-Textures" name="scaleUvCoordinatesBackgroundCCTextures" initialValue={5}>
                            <InputNumber style={{width: '100%'}}/>
                </Form.Item>
                < Form.Item label="Scale UV Coordinates Custom Textures" name="scaleUvCoordinatesBackgroundCCCustomTextures" initialValue={2}>
                            <InputNumber style={{width: '100%'}}/>
                </Form.Item>
          </Form>
          <Flex gap="small" justify="right">
          <Button>Cancel</Button>
            <Button type="primary" onClick={handleGenerateSyntheticDataclick} >Generate Synthetic Data</Button>
        </Flex>
      </Card>
        }]

    return (
        <Card             size="small"
        style={{
            width: '100%', 
            margin: '4px', 
            backgroundColor: '#313131',
            borderRadius: '10px',
            padding: '8px'
        }}>
        <Collapse 
            size="small" 
            bordered={false}
            items={items} 
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            style={{ width: '100%', margin: '4px'}}

        />
        <Flex gap="small" justify="right">
        <Button>Cancel</Button>
        <Button type="primary" onClick={handlePreviewSyntheticDataclick} >Preview</Button>
          <Button type="primary" onClick={handleGenerateSyntheticDataclick} >Generate Synthetic Data</Button>
      </Flex>
            </Card>
    );
}

export const ModelTraining = () => {
    const [form] = Form.useForm();

    const handleValuesChange = (changedValues, allValues) => {
        console.log('SyntheticDataGeneration Values:', allValues);
    };

    
    const items = [
        {
          key: '1',
          label: 'Model Training',
          children: 
          <Card 
          size="small"
          type="inner"
          bordered 
          style={{ width: '100%' }}
          >
          <Form 
              form={form}
              onValuesChange={handleValuesChange}
              layout="horizontal"
              labelCol={{
                span: 12,
              }}
              wrapperCol={{
                span: 32,
              }}
              style={{width: '100%'}}
          >
              <Form.Item label="Dataset Path" name="datasetPath" initialValue={"C:/Repos/cortex/synthetic_data_"}>
                  <Input style={{width: '100%'}} />
              </Form.Item>
              <Form.Item label="Image File Format:" name="imageFileFormat" initialValue={"JPEG"}>
                <Select style={{ width: '100%' }}>
                    <Option value="JPEG">JPEG</Option>
                    <Option value="PNG">PNG</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Number of Images" name="numImages" initialValue={100}>
                  <InputNumber style={{width: '100%'}}/>
              </Form.Item>
              </Form>
          <Flex gap="small" justify="right">
          <Button>Cancel</Button>
            <Button type="primary">Generate Synthetic Data</Button>
        </Flex>
      </Card>
        }]

    return (
        <Card             size="small"
        style={{
            width: '100%', 
            margin: '4px', 
            backgroundColor: '#313131',
            borderRadius: '10px',
            padding: '8px'
        }}>
        <Collapse 
            size="small" 
            bordered={false}
            items={items} 
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            style={{ width: '100%', margin: '4px'}}

        />
        <Flex gap="small" justify="right">
        <Button>Cancel</Button>
          <Button type="primary">Launch Model Training</Button>
      </Flex>
            </Card>
    );
}

export const DeepLearningDetector = ({socketInstance, productTreeData}) => {
    const [form] = Form.useForm();

    const handleValuesChange = (changedValues, allValues) => {
        console.log('Assign Values:', allValues);
    };

    return (
        <div>
            <Form 
              form={form}
              onValuesChange={handleValuesChange}
              layout="horizontal"
              labelCol={{
                span: 12,
              }}
              wrapperCol={{
                span: 32,
              }}
              style={{width: '100%'}}
          >
              <Form.Item label="Detector Name" name="name" initialValue={"Deep Learning Detector"}>
                  <Input style={{width: '100%'}} />
              </Form.Item>
              <Form.Item label="Product" name="product_name" initialValue={""}>
                  <Input style={{width: '100%'}} />
              </Form.Item>
            </Form>
            < SyntheticDataGeneration socketInstance={socketInstance} productTreeData={productTreeData}/>
            < ModelTraining/>
        </div>
    )
        
}

export const CircleDetector = ({socketInstance, detectorInputImagesUrls, selectedDetector, handleDetectorData}) => {
    const [form] = Form.useForm();

    const convertImageUrlsToBinary = async (imageUrls) => {
        const imageBinaries = await Promise.all(imageUrls.map(async (imageUrl) => {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const reader = new FileReader();

            return new Promise((resolve, reject) => {
                reader.onloadend = () => {
                    resolve(reader.result);
                };

                reader.onerror = reject;
                reader.readAsArrayBuffer(blob);
            });
        }));

        return imageBinaries;
      };  

      const handleValuesChange = async (changedValues, allValues) => {
        const imageBinaries = await convertImageUrlsToBinary(detectorInputImagesUrls);
        const newDict = { "type": selectedDetector, "images": imageBinaries };
        
        // Merge the new dictionary with allValues
        const mergedData = { ...allValues, ...newDict };
        handleDetectorData(mergedData)

        socketInstance.emit('SetupDetector', mergedData);
        console.log('Setup Detector data is sent: ', mergedData);
    };

    return(
            <Form 
              form={form}
              onValuesChange={handleValuesChange}
              layout="horizontal"
              labelCol={{
                span: 12,
              }}
              wrapperCol={{
                span: 32,
              }}
              style={{width: '100%'}}
          >
              <Form.Item 
                label="Name" name="name" initialValue={"Default Circle Detector"}
                tooltip="Name of the detector.">
                  <Input style={{width: '100%'}} />
              </Form.Item>
              <Form.Item 
                label="Product" name="product_name" initialValue={""}
                tooltip="Name of the product.">
                  <Input style={{width: '100%'}} />
              </Form.Item>

              <Divider>Circle</Divider>

              <Form.Item 
                label="Diameter" name="diameter" initialValue={800}
                tooltip="Minimum distance between the centers of the detected circles. 
                If the parameter is too small, multiple neighbor circles may be falsely 
                detected in addition to a true one. If it is too large, some circles may be missed.">
                  <InputNumber style={{width: '100%'}} />
              </Form.Item>
              <Form.Item 
                label="Minimum Diameter" name="min_diameter" initialValue={600}
                tooltip="Minimum circle diameter.">
                  <InputNumber style={{width: '100%'}} />
              </Form.Item>
              <Form.Item 
                label="Maximum Diameter" name="max_diameter" initialValue={1000}
                tooltip="Maximum circle diameter.">
                  <InputNumber style={{width: '100%'}} />
              </Form.Item>

              <Divider>Bilateral Filter</Divider>

              <Form.Item 
                label="Diameter" name="bilateral_filter_diameter" initialValue={15}
                tooltip="Diameter of each pixel neighborhood that is used during filtering. 
                Large filters (d > 5) are very slow, so it is recommended to use d=5 for real-time applications, 
                and perhaps d=9 for offline applications that need heavy noise filtering.">
                  <InputNumber style={{width: '100%'}} />
              </Form.Item>
              <Form.Item 
                label="Sigma Color" name="bilateral_filter_sigma_color" initialValue={75}
                tooltip="Maximum circle diameter.">
                  <InputNumber style={{width: '100%'}} />
              </Form.Item>
              <Form.Item 
                label="Sigma Space" name="bilateral_filter_sigma_space" initialValue={75}
                tooltip="Maximum circle diameter.">
                  <InputNumber style={{width: '100%'}} />
              </Form.Item>

              <Divider>Median Blur</Divider>

              <Form.Item 
                label="Kernel Size" name="median_blur_kernel_size" initialValue={11}
                tooltip="Maximum circle diameter.">
                  <InputNumber style={{width: '100%'}} />
              </Form.Item>

              <Divider>Canny Edge</Divider>

              <Form.Item 
                label="Upper Threshold" name="canny_upper_thresh" initialValue={75}
                tooltip="Maximum circle diameter.">
                  <InputNumber style={{width: '100%'}} />
              </Form.Item>

              <Divider>Accummulator</Divider>

              <Form.Item 
                label="Threshold" name="accumulator_thresh" initialValue={27}
                tooltip="Maximum circle diameter.">
                  <InputNumber style={{width: '100%'}} />
              </Form.Item>
              <Form.Item 
                label="Bounding Box Percentage" name="bbox_percentage" initialValue={1.2}
                tooltip="Maximum circle diameter.">
                  <InputNumber style={{width: '100%'}} />
              </Form.Item>

              <Divider>Visualization</Divider>

                <Form.Item 
                    label="Circle Color" name="circle_color" initialValue={"Green"}
                    tooltip="Maximum circle diameter.">
                    <Select
                        defaultValue="Green"
                        style={{width: '100%'}}
                    >
                        <Option value="Green">Green</Option>
                        <Option value="Red">Red</Option>
                        <Option value="Blue">Blue</Option>
                    </Select>
                </Form.Item>
                <Form.Item 
                    label="Bounding Box Color" name="bbox_color" initialValue={"Green"}
                    tooltip="Maximum circle diameter.">
                    <Select
                        defaultValue="Green"
                        style={{width: '100%'}}
                    >
                        <Option value="Green">Green</Option>
                        <Option value="Red">Red</Option>
                        <Option value="Blue">Blue</Option>
                    </Select>
                </Form.Item>
                <Form.Item 
                    label="Text Color" name="text_color" initialValue={"Red"}
                    tooltip="Maximum circle diameter.">
                    <Select
                        defaultValue="Red"
                        style={{width: '100%'}}
                    >
                        <Option value="Green">Green</Option>
                        <Option value="Red">Red</Option>
                        <Option value="Blue">Blue</Option>
                    </Select>
                </Form.Item>
              <Form.Item 
                label="Line Thickness" name="line_thickness" initialValue={6}
                tooltip="Maximum circle diameter.">
                  <InputNumber style={{width: '100%'}} />
              </Form.Item>
              <Form.Item 
                label="Show Order" name="show_order" initialValue={"True"}
                tooltip="Maximum circle diameter.">
                <Select
                    defaultValue="True"
                    style={{width: '100%'}}
                >
                    <Option value="True">True</Option>
                    <Option value="False">False</Option>
                </Select>
              </Form.Item>
              <Form.Item 
                label="Show Diameter" name="show_diameter" initialValue={"True"}
                tooltip="Maximum circle diameter.">
                <Select
                    defaultValue="True"
                    style={{width: '100%'}}
                >
                    <Option value="True">True</Option>
                    <Option value="False">False</Option>
                </Select>
              </Form.Item>
          </Form>
    )
}

const ThresholdContourSegmentor = () => {
    return (
        <>
            <Divider>Threshold Segmentor</Divider>

            <Form.Item label="Threshold" name="threshold_segmenter_lower_bound" initialValue={127}>
                <InputNumber style={{width: '100%'}} />
            </Form.Item>
            <Form.Item label="Maximum Value" name="threshold_segmenter_upper_bound" initialValue={255}>
                <InputNumber style={{width: '100%'}} />
            </Form.Item>
            <Form.Item label="Threshold Type" name="threshold_segmenter_threshold_type" initialValue={0}>
                <InputNumber style={{width: '100%'}} />
            </Form.Item>
            <Form.Item label="Blurring Kernel Size" name="threshold_segmenter_blurring_kernel_size" initialValue={5}>
                <InputNumber style={{width: '100%'}} />
            </Form.Item>

            <Divider>Contour Segmentor</Divider>

            <Form.Item label="Minimum Area Threshold" name="contour_segmenter_min_area_threshold" initialValue={100}>
                <InputNumber style={{width: '100%'}} />
            </Form.Item>
            <Form.Item label="Maximum Area Threshold" name="contour_segmenter_max_area_threshold" initialValue={100000}>
                <InputNumber style={{width: '100%'}} />
            </Form.Item>
        </>
    )
}

const HSVSegmentor = () => {
    return (
        <>
            <Divider>HSV Segmentor</Divider>

            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="Hue min"
                            name="hue_min"
                            initialValue={0}
                            min={0}
                            max={255}
                            tooltip="Minimum value of the hue. Valid range is [0,255]."
                        >
                            <InputNumber style={{ width: '100%' }} step={1}/>
                        </Form.Item>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="Hue max"
                            name="hue_max"
                            initialValue={255}
                            min={0}
                            max={255}
                            tooltip="Maximum value of the hue. Valid range is [0,255]."
                        >
                            <InputNumber style={{ width: '100%' }} step={1}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="Saturation min"
                            name="saturation_min"
                            initialValue={0}
                            min={0}
                            max={255}
                            tooltip="Minimum value of the saturation. Valid range is [0,255]."
                        >
                            <InputNumber style={{ width: '100%' }} step={1}/>
                        </Form.Item>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="Saturation max"
                            name="saturation_max"
                            initialValue={255}
                            min={0}
                            max={255}
                            tooltip="Maximum value of the saturation. Valid range is [0,255]."
                        >
                            <InputNumber style={{ width: '100%' }} step={1}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="Value min"
                            name="value_min"
                            initialValue={0}
                            min={0}
                            max={255}
                            tooltip="Minimum value of the value. Valid range is [0,255]."
                        >
                            <InputNumber style={{ width: '100%' }} step={1}/>
                        </Form.Item>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="Value max"
                            name="value_max"
                            initialValue={255}
                            min={0}
                            max={255}
                            tooltip="Maximum value of the value. Valid range is [0,255]."
                        >
                            <InputNumber style={{ width: '100%' }} step={1}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form.Item>
        </>
    )
}

const HSVContourSegmentor = () => {
    return (
        <>
            <Divider>HSV Segmentor</Divider>

            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="Hue min"
                            name="hue_min"
                            initialValue={0}
                            min={0}
                            max={255}
                            tooltip="Minimum value of the hue. Valid range is [0,255]."
                        >
                            <InputNumber style={{ width: '100%' }} step={1}/>
                        </Form.Item>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="Hue max"
                            name="hue_max"
                            initialValue={255}
                            min={0}
                            max={255}
                            tooltip="Maximum value of the hue. Valid range is [0,255]."
                        >
                            <InputNumber style={{ width: '100%' }} step={1}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="Saturation min"
                            name="saturation_min"
                            initialValue={0}
                            min={0}
                            max={255}
                            tooltip="Minimum value of the saturation. Valid range is [0,255]."
                        >
                            <InputNumber style={{ width: '100%' }} step={1}/>
                        </Form.Item>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="Saturation max"
                            name="saturation_max"
                            initialValue={255}
                            min={0}
                            max={255}
                            tooltip="Maximum value of the saturation. Valid range is [0,255]."
                        >
                            <InputNumber style={{ width: '100%' }} step={1}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item>
                <Row gutter={16} justify="end">
                    <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="Value min"
                            name="value_min"
                            initialValue={0}
                            min={0}
                            max={255}
                            tooltip="Minimum value of the value. Valid range is [0,255]."
                        >
                            <InputNumber style={{ width: '100%' }} step={1}/>
                        </Form.Item>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                        <Form.Item
                            label="Value max"
                            name="value_max"
                            initialValue={255}
                            min={0}
                            max={255}
                            tooltip="Maximum value of the value. Valid range is [0,255]."
                        >
                            <InputNumber style={{ width: '100%' }} step={1}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form.Item>

            <Divider>Contour Segmentor</Divider>

            <Form.Item label="Minimum Area Threshold" name="contour_segmenter_min_area_threshold" initialValue={100}>
                <InputNumber style={{width: '100%'}} />
            </Form.Item>
            <Form.Item label="Maximum Area Threshold" name="contour_segmenter_max_area_threshold" initialValue={100000}>
                <InputNumber style={{width: '100%'}} />
            </Form.Item>
        </>
    )
}

export const TemplateMatcher = ({socketInstance, detectorInputImagesUrls, selectedDetector, handleDetectorData}) => {
    const [form] = Form.useForm();
    const [selectedSegmentor, setSelectedSegmentor] = useState('Threshold Contour Segmentor');

    const handleSelectedSegmentor = (segmentorModel) => {
        setSelectedSegmentor(segmentorModel);
    }

    const convertImageUrlsToBinary = async (imageUrls) => {
        const imageBinaries = await Promise.all(imageUrls.map(async (imageUrl) => {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const reader = new FileReader();

            return new Promise((resolve, reject) => {
                reader.onloadend = () => {
                    resolve(reader.result);
                };

                reader.onerror = reject;
                reader.readAsArrayBuffer(blob);
            });
        }));

        return imageBinaries;
    };

    const handleValuesChange = async (changedValues, allValues) => {
            const imageBinaries = await convertImageUrlsToBinary(detectorInputImagesUrls);
            const newDict = { "type": selectedDetector, "images": imageBinaries };

            // Merge the new dictionary with allValues
            const mergedData = { ...allValues, ...newDict };
            handleDetectorData(mergedData)

            socketInstance.emit('SetupDetector', mergedData);
            console.log('Setup Detector data is sent: ', mergedData);
    };

    return(
            <Form
                form={form}
                onValuesChange={handleValuesChange}
                layout="horizontal"
                labelCol={{
                    span: 12,
                }}
                wrapperCol={{
                    span: 32,
                }}
                style={{width: '100%'}}
            >
                <Form.Item label="Name" name="name" initialValue={"Default Template Matcher"}>
                    <Input style={{width: '100%'}} />
                </Form.Item>
                <Form.Item label="Product" name="product_name" initialValue={""}>
                        <Input style={{width: '100%'}} />
                </Form.Item>

                <Divider>Template Image</Divider>

                <Form.Item label="Image File Name" name="template" initialValue={"template_46421.png"}>
                    <Input style={{width: '100%'}} />
                </Form.Item>

                <ThresholdContourSegmentor />
    
                <Divider>Metric Sampler</Divider>
    
                <Form.Item label="Range Minimum" name="metric_sampler_range_min" initialValue={0}>
                    <InputNumber style={{width: '100%'}} />
                </Form.Item>
                <Form.Item label="Range Maximum" name="metric_sampler_range_max" initialValue={360}>
                    <InputNumber style={{width: '100%'}} />
                </Form.Item>
                <Form.Item label="Step Size" name="metric_sampler_step_size" initialValue={0.1}>
                    <InputNumber style={{width: '100%'}} />
                </Form.Item>
                <Form.Item label="Metric Name" name="metric_sampler_metric_name" initialValue={"iou"}>
                    <Select
                        defaultValue="iou"
                        style={{width: '100%'}}
                    >
                        <Option value="iou">iou</Option>
                        <Option value="dice">dice</Option>
                    </Select>
                </Form.Item>
    
                <Divider>Cropper</Divider>
    
                <Form.Item label="Make Square" name="nonzero_cropper_make_square" initialValue={"True"}>
                    <Select
                        defaultValue="True"
                        style={{width: '100%'}}
                    >
                        <Option value="True">True</Option>
                        <Option value="False">False</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Border Padding" name="nonzero_cropper_border_padding" initialValue={0}>
                    <InputNumber style={{width: '100%'}} />
                </Form.Item>
    
                <Divider>Orientation</Divider>
    
                <Form.Item label="Y Orientation Radian" name="y_orientation_rad" initialValue={0}>
                    <InputNumber style={{width: '100%'}} />
                </Form.Item>
            </Form>
        )
}

export const GeneralizedTemplateMatcher = ({socketInstance, detectorInputImagesUrls, selectedDetector, handleDetectorData}) => {
    const [form] = Form.useForm();
    const [selectedSegmentor, setSelectedSegmentor] = useState('Threshold Contour Segmentor');

    const handleSelectedSegmentor = (segmentorModel) => {
        setSelectedSegmentor(segmentorModel);
    }

    const convertImageUrlsToBinary = async (imageUrls) => {
        const imageBinaries = await Promise.all(imageUrls.map(async (imageUrl) => {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const reader = new FileReader();

            return new Promise((resolve, reject) => {
                reader.onloadend = () => {
                    resolve(reader.result);
                };

                reader.onerror = reject;
                reader.readAsArrayBuffer(blob);
            });
        }));

        return imageBinaries;
    };

    const handleValuesChange = async (changedValues, allValues) => {
        const imageBinaries = await convertImageUrlsToBinary(detectorInputImagesUrls);
        const newDict = { "type": selectedDetector, "images": imageBinaries };

        // Merge the new dictionary with allValues
        const mergedData = { ...allValues, ...newDict };
        handleDetectorData(mergedData)

        socketInstance.emit('SetupDetector', mergedData);
        console.log('Setup Detector data is sent: ', mergedData);
    };

    return(
        <Form
            form={form}
            onValuesChange={handleValuesChange}
            layout="horizontal"
            labelCol={{
                span: 12,
            }}
            wrapperCol={{
                span: 32,
            }}
            style={{width: '100%'}}
        >
            <Form.Item label="Name" name="name" initialValue={"Default Template Matcher"}>
                <Input style={{width: '100%'}} />
            </Form.Item>
            <Form.Item label="Product" name="product_name" initialValue={""}>
                <Input style={{width: '100%'}} />
            </Form.Item>

            <Divider>Template Image</Divider>

            <Form.Item label="Image File Name" name="template" initialValue={"template_46421.png"}>
                <Input style={{width: '100%'}} />
            </Form.Item>

            <Divider>Segmentor Type</Divider>

            <Form.Item
                label="Segmentor Model"
                name="segmentor_name"
                initialValue={"Threshold Contour Segmentor"}
                layout="horizontal"
                labelCol={{
                    span: 12,
                }}
                wrapperCol={{
                    span: 32,
                }}
                style={{width: '100%'}}
            >
                <Select
                    defaultValue="Threshold Contour Segmentor"
                    style={{width: '100%'}}
                    onChange={(value) => handleSelectedSegmentor(value)}
                >
                    <Option value="Threshold Contour Segmentor">Threshold Contour Segmentor</Option>
                    <Option value="HSV Segmentor">HSV Segmentor</Option>
                    <Option value="HSV Contour Segmentor">HSV Contour Segmentor</Option>
                </Select>
            </Form.Item>

            {selectedSegmentor === 'Threshold Contour Segmentor' && <ThresholdContourSegmentor key="ThresholdContourSegmentor" />}
            {selectedSegmentor === 'HSV Segmentor' && <HSVSegmentor key="HSVSegmentor" />}
            {selectedSegmentor === 'HSV Contour Segmentor' && <HSVContourSegmentor key="HSVContourSegmentor" />}

            <Divider>Metric Sampler</Divider>

            <Form.Item label="Range Minimum" name="metric_sampler_range_min" initialValue={0}>
                <InputNumber style={{width: '100%'}} />
            </Form.Item>
            <Form.Item label="Range Maximum" name="metric_sampler_range_max" initialValue={360}>
                <InputNumber style={{width: '100%'}} />
            </Form.Item>
            <Form.Item label="Step Size" name="metric_sampler_step_size" initialValue={0.1}>
                <InputNumber style={{width: '100%'}} />
            </Form.Item>
            <Form.Item label="Metric Name" name="metric_sampler_metric_name" initialValue={"iou"}>
                <Select
                    defaultValue="iou"
                    style={{width: '100%'}}
                >
                    <Option value="iou">iou</Option>
                    <Option value="dice">dice</Option>
                </Select>
            </Form.Item>

            <Divider>Cropper</Divider>

            <Form.Item label="Make Square" name="nonzero_cropper_make_square" initialValue={"True"}>
                <Select
                    defaultValue="True"
                    style={{width: '100%'}}
                >
                    <Option value="True">True</Option>
                    <Option value="False">False</Option>
                </Select>
            </Form.Item>
            <Form.Item label="Border Padding" name="nonzero_cropper_border_padding" initialValue={0}>
                <InputNumber style={{width: '100%'}} />
            </Form.Item>

            <Divider>Orientation</Divider>

            <Form.Item label="Y Orientation Radian" name="y_orientation_rad" initialValue={0}>
                <InputNumber style={{width: '100%'}} />
            </Form.Item>
        </Form>
    )
}

export const SolvePnPPoseEstimator = ({socketInstance, handleDetectorData}) => {
        const [form] = Form.useForm();

        const handleValuesChange = (changedValues, allValues) => {
            console.log('Assign Values:', allValues);
            handleDetectorData(allValues);
        };
    
        return (
                <Form 
                  form={form}
                  onValuesChange={handleValuesChange}
                  layout="horizontal"
                  labelCol={{
                    span: 12,
                  }}
                  wrapperCol={{
                    span: 32,
                  }}
                  style={{width: '100%'}}
              >
                  <Form.Item label="Name" name="name" initialValue={"Default SolvePnP Pose Estimator"}>
                      <Input style={{width: '100%'}} />
                  </Form.Item>
                  <Form.Item label="Product" name="product_name" initialValue={""}>
                      <Input style={{width: '100%'}} />
                  </Form.Item>

                  <Form.Item 
                                label="camera" 
                                name="camera" 
                                layout="horizontal"
                                labelCol={{
                                        span: 12,
                                }}
                                wrapperCol={{
                                        span: 32,
                                }}
                                style={{width: '100%'}}
                        >
                                <Select
                                        defaultValue="zivid m70"
                                        style={{width: '100%'}}
                                >
                                        <Option value="zivid m70">zivid m70</Option>
                                        <Option value="azure kinect">azure kinect</Option>
                                        <Option value="IDS">IDS</Option>
                                        <Option value="lucid">lucid</Option>
                                        <Option value="real sense">real sense</Option>
                                </Select>

                        </Form.Item>

                </Form>
        )
}
        
export const ClusteredICPPoseEstimator = ({socketInstance, handleDetectorData,detectorInputPointCloud,setViewPcdCenterX,setViewPcdCenterY,
        setViewPcdCenterZ,setFilterRadius}) => {

        // const [scaleEnabled, setScaleEnabled] = useState(false);
        const [samplerEnabled, setSamplerEnabled] = useState(false);
        const [localICPEnabled, setLocalICPEnabled] = useState(false);
        // const [alphaFilteringEnabled, setAlphaFilteringEnabled] = useState(false);


        const handleValuesChange = (changedValues, allValues) => {
                console.log('Assign Values:', allValues);
                setViewPcdCenterX(allValues["center_x"])
                setViewPcdCenterY(allValues["center_y"])
                setViewPcdCenterZ(allValues["center_z"])
                setFilterRadius(allValues["filter_radius"])
                handleDetectorData(allValues);
                // socketInstance.emit('SetupDetector', mergedData);
                // console.log('Setup Detector data is sent: ', mergedData);
            };

        const [form] = Form.useForm();
        

        const formItemLayout = {
                labelCol: {
                  xs: {
                    span: 24,
                  },
                  sm: {
                    span: 4,
                  },
                },
                wrapperCol: {
                  xs: {
                    span: 24,
                  },
                  sm: {
                    span: 20,
                  },
                },
              };
              
              
        return (
                <Form 
                  form={form}
                  onValuesChange={handleValuesChange}
                  layout="horizontal"
                  labelCol={{
                    span: 12,
                  }}
                  wrapperCol={{
                    span: 32,
                  }}
                  style={{width: '100%'}}
              >
                  <Form.Item label="Name" name="name" initialValue={"Clustered ICP Pose Estimator"}>
                  <Input style={{width: '100%'}} />
                  </Form.Item>
                  
                  <Form.Item label="Product" name="product_name" initialValue={""}>
                      <Input style={{width: '100%'}} />
                  </Form.Item>
  
                  <Divider>Passthrough Filter</Divider>
                  
                  <Form.Item label="Point Cloud Center X:" name="center_x" initialValue={0}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  <Form.Item label="Y:" name="center_y" initialValue={0}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  <Form.Item label="Z:" name="center_z" initialValue={0}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  <Form.Item label="Passthrough Filter Radius" name="filter_radius" initialValue={150}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
                  
  
                  <Divider>Voxel Downsampling</Divider>
  
                  <Form.Item label="Voxel Nearest Neighbour" name="voxel_nearest_neighbour" initialValue={16}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
                  
                  <Form.Item label="Standard Deviation Multiplier" name="voxel_std_multiplier" initialValue={10}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  <Form.Item label="Voxel Size" name="voxel_size" initialValue={0.01}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
  
                  <Divider>Ransac Plane filter</Divider>

                  <Form.Item label="Number of Planes" name="filter_max_plane" initialValue={1}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
  
                  <Form.Item label="Distance Threshold" name="filter_distance_threshold" initialValue={1}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  

                  <Divider>Ransac Plane Detection</Divider>
                  <Form.Item label="Number of Planes" name="ransac_detect_max_plane" initialValue={1}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
  
                  <Form.Item label="Distance Threshold" name="ransac_detect_distance_threshold" initialValue={7}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  
  
                  <Divider>DBScan Clustering</Divider>
  
                  <Form.Item label="Distance Threshold" name="dbscan_distance_threshold" initialValue={7}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  <Form.Item label="Minimum Points" name="dbscan_min_points" initialValue={300}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
  
                  <Divider>Global ICP</Divider>
                  <Form.Item
                     name ="global_icp_required_sampler"
                     valuePropName='checked'
                     initialValue={false}>
                     <Checkbox checked={samplerEnabled}
                     onChange={(e) => setSamplerEnabled(e.target.checked)}>
                     Sampler
                     
                     </Checkbox>
                     </Form.Item>
                     
                     <Form
                     form={form}
                     onValuesChange={handleValuesChange}
                     layout="horizontal"
                     labelCol={{
                     span: 12,
                     }}
                     wrapperCol={{
                     span: 32,
                     }}
                     disabled={!samplerEnabled}
             
                     style={{width: '100%'}}
                  >

                     <Form.Item label="Random Seed" name="random_seed" initialValue={42}>
                           <InputNumber style={{width: '100%'}} />
                     </Form.Item>

                     <Form.Item label="Distance Threshold"      name="global_icp_threshold" initialValue={1}>
                           <InputNumber style={{width: '100%'}} />
                      </Form.Item>

                      <Form.Item label="Iteration" name="global_icp_iteration" initialValue={10}>
                           <InputNumber style={{width: '100%'}} />
                     </Form.Item>

                     <Form.Item 
                                     label="ICP Variant" 
                                     name="global_icp_variant" 
                                     layout="horizontal"
                                     labelCol={{
                                             span: 12,
                                     }}
                                     wrapperCol={{
                                             span: 32,
                                     }}
                                     style={{width: '100%'}}
                                     initialValue={"PointToPlane"}
                             >
                                     <Select
                                             defaultValue="PointToPlane"
                                             style={{width: '100%'}}

                                     >
                                             <Option value="PointToPoint">Point To Point</Option>
                                             <Option value="PointToPlane">Point To Plane</Option>
                                     </Select>
     
                     </Form.Item>
                     <Form.Item label="Sampler Products">
                     <Form
                      form={form}
                      onValuesChange={handleValuesChange}
                      layout="horizontal"
                      labelCol={{
                      span: 12,
                      }}
                      wrapperCol={{
                      span: 32,
                      }}
                      disabled={!samplerEnabled}
              
                      style={{width: '100%'}}
                        > 
                          <Form.List
                            name="global_icp_sample_index"
                            initialValue={[]}
                            
                          >
                            {(fields, { add, remove }, { errors }) => (
                              <>
                              <Flex gap="middle" align='start' vertical>  
                                {fields.map((field, index) => (     
                                  <Form.Item
                                    {...formItemLayout}
                                    required={false}
                                    key={field.key}
                                  >

                                    <Form.Item
                                      {...field}
                                      validateTrigger={['onChange', 'onBlur']}
                                      rules={[
                                        {
                                          required: true,
                                          whitespace: true,
                                          message:"please enter a object or remove this field"
                                        },
                                      ]}
                                      noStyle
                                    >
                                      <Input placeholder="Product Name" style={{ width: '90%' }} />
                                    </Form.Item>
                                    {fields.length > 0 ? (
                                      <MinusCircleOutlined
                                        className="dynamic-delete-button"
                                        onClick={() => remove(field.name)}
                                      />
                                    ) : null}
                                  </Form.Item>
                                ))}
                                <Form.Item>
                                  <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{ width: '100%' }}
                                    icon={<PlusOutlined />}
                                  >
                                    Add Product
                                  </Button>
                                  <Form.ErrorList errors={errors} />
                                </Form.Item>
                                </Flex>
                              </>
                            )}
                          </Form.List>
                        </Form>
                        </Form.Item>
                        <Form.Item label="Number of Samples" name="global_icp_num_sample" initialValue={300}>
                           <InputNumber style={{width: '100%'}} />
                        </Form.Item>
                        </Form>   
                
                     

                  <Divider>Local ICP</Divider>
                  <Form.Item
                     name ="local_icp_is_required"
                     valuePropName='checked'
                     initialValue={false}>
                     <Checkbox checked={localICPEnabled}
                     onChange={(e) => setLocalICPEnabled(e.target.checked)}>
                     Local ICP
                     
                     </Checkbox>
                     </Form.Item>
                     
                     <Form
                     form={form}
                     onValuesChange={handleValuesChange}
                     layout="horizontal"
                     labelCol={{
                     span: 12,
                     }}
                     wrapperCol={{
                     span: 32,
                     }}
                     disabled={!localICPEnabled}
             
                     style={{width: '100%'}}
                  >
                     <Form.Item label="Distance Threshold" name="local_icp_max_correspondence_distance" initialValue={15}>
                           <InputNumber style={{width: '100%'}} />
                      </Form.Item>
     
                     <Form.Item label="Iteration" name="local_icp_max_iteration" initialValue={1000}>
                           <InputNumber style={{width: '100%'}} />
                     </Form.Item>
          
                     <Form.Item 
                                     label="ICP Variant" 
                                     name="local_icp_variant" 
                                     layout="horizontal"
                                     labelCol={{
                                             span: 12,
                                     }}
                                     wrapperCol={{
                                             span: 32,
                                     }}
                                     style={{width: '100%'}}
                                     initialValue={"PointToPoint"}
                             >
                                     <Select
                                             defaultValue="PointToPoint"
                                             style={{width: '100%'}}
                                     >
                                             <Option value="PointToPoint">Point To Point</Option>
                                             <Option value="PointToPlane">Point To Plane</Option>
                                     </Select>
     
                     </Form.Item>
                  </Form>
                </Form>
    )
}

export const ClusteredFfphIcpPoseEstimator = ({socketInstance, handleDetectorData,detectorInputPointCloud,setViewPcdCenterX,setViewPcdCenterY,
        setViewPcdCenterZ,setFilterRadius}) => {
                
        const [localICPEnabled, setLocalICPEnabled] = useState(false);
        // const [alphaFilteringEnabled, setAlphaFilteringEnabled] = useState(false);


        const handleValuesChange = (changedValues, allValues) => {
                console.log('Assign Values:', allValues);
                setViewPcdCenterX(allValues["center_x"])
                setViewPcdCenterY(allValues["center_y"])
                setViewPcdCenterZ(allValues["center_z"])
                setFilterRadius(allValues["filter_radius"])
                handleDetectorData(allValues);
                // socketInstance.emit('SetupDetector', mergedData);
                // console.log('Setup Detector data is sent: ', mergedData);
            };

        const [form] = Form.useForm();
        

       
              
              
        return (
                <Form 
                  form={form}
                  onValuesChange={handleValuesChange}
                  layout="horizontal"
                  labelCol={{
                    span: 12,
                  }}
                  wrapperCol={{
                    span: 32,
                  }}
                  style={{width: '100%'}}
              >
                  <Form.Item label="Name" name="name" initialValue={"Clustered Ffph ICP Pose Estimator"}>
                  <Input style={{width: '100%'}} />
                  </Form.Item>
                  
                  <Form.Item label="Product" name="product_name" initialValue={""}>
                      <Input style={{width: '100%'}} />
                  </Form.Item>
  
                  <Divider>Passthrough Filter</Divider>
                  
                  <Form.Item label="Point Cloud Center X:" name="center_x" initialValue={0}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  <Form.Item label="Y:" name="center_y" initialValue={0}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  <Form.Item label="Z:" name="center_z" initialValue={0}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  <Form.Item label="Passthrough Filter Radius" name="filter_radius" initialValue={150}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
                  
  
                  <Divider>Voxel Downsampling</Divider>
  
                  <Form.Item label="Voxel Nearest Neighbour" name="voxel_nearest_neighbour" initialValue={16}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
                  
                  <Form.Item label="Standard Deviation Multiplier" name="voxel_std_multiplier" initialValue={10}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  <Form.Item label="Voxel Size" name="voxel_size" initialValue={0.01}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
  
                  <Divider>Ransac Plane filter</Divider>

                  <Form.Item label="Number of Planes" name="filter_max_plane" initialValue={1}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
  
                  <Form.Item label="Distance Threshold" name="filter_distance_threshold" initialValue={1}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  

                  <Divider>Ransac Plane Detection</Divider>
                  <Form.Item label="Number of Planes" name="ransac_detect_max_plane" initialValue={1}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
  
                  <Form.Item label="Distance Threshold" name="ransac_detect_distance_threshold" initialValue={7}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  
  
                  <Divider>DBScan Clustering</Divider>
  
                  <Form.Item label="Distance Threshold" name="dbscan_distance_threshold" initialValue={7}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  <Form.Item label="Minimum Points" name="dbscan_min_points" initialValue={300}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
  
                  <Divider>Global FFPH Registration</Divider>
                                       
                     <Form
                     form={form}
                     onValuesChange={handleValuesChange}
                     layout="horizontal"
                     labelCol={{
                     span: 12,
                     }}
                     wrapperCol={{
                     span: 32,
                     }}             
                     style={{width: '100%'}}
                  >

                     <Form.Item label="ffph Voxel Size"  name="global_ffph_voxel_size" initialValue={1}>
                           <InputNumber style={{width: '100%'}} />
                      </Form.Item>
                     <Form.Item label="Distance Threshold"  name="global_ffph_threshold" initialValue={1}>
                           <InputNumber style={{width: '100%'}} />
                      </Form.Item>

                      <Form.Item label="Iteration" name="global_ffph_iteration" initialValue={10}>
                           <InputNumber style={{width: '100%'}} />
                     </Form.Item>
                     <Form.Item 
                                     label="FFPH Variant" 
                                     name="global_ffph_variant" 
                                     layout="horizontal"
                                     labelCol={{
                                             span: 12,
                                     }}
                                     wrapperCol={{
                                             span: 32,
                                     }}
                                     style={{width: '100%'}}
                                     initialValue={"ransac"}
                             >
                                     <Select
                                             defaultValue="ransac"
                                             style={{width: '100%'}}
                                     >
                                             <Option value="ransac">Ransac Ffph</Option>
                                             <Option value="fast_global_registration">Fast Global Registration</Option>
                                     </Select>
     
                     </Form.Item>
                        </Form>   

                  <Divider>Local ICP</Divider>
                  <Form.Item
                     name ="local_icp_is_required"
                     valuePropName='checked'
                     initialValue={false}>
                     <Checkbox checked={localICPEnabled}
                     onChange={(e) => setLocalICPEnabled(e.target.checked)}>
                     Local ICP
                     
                     </Checkbox>
                     </Form.Item>
                     
                     <Form
                     form={form}
                     onValuesChange={handleValuesChange}
                     layout="horizontal"
                     labelCol={{
                     span: 12,
                     }}
                     wrapperCol={{
                     span: 32,
                     }}
                     disabled={!localICPEnabled}
             
                     style={{width: '100%'}}
                  >
                     <Form.Item label="Distance Threshold" name="local_icp_max_correspondence_distance" initialValue={15}>
                           <InputNumber style={{width: '100%'}} />
                      </Form.Item>
     
                     <Form.Item label="Iteration" name="local_icp_max_iteration" initialValue={1000}>
                           <InputNumber style={{width: '100%'}} />
                     </Form.Item>
          
                     <Form.Item 
                                     label="ICP Variant" 
                                     name="local_icp_variant" 
                                     layout="horizontal"
                                     labelCol={{
                                             span: 12,
                                     }}
                                     wrapperCol={{
                                             span: 32,
                                     }}
                                     style={{width: '100%'}}
                                     initialValue={"PointToPoint"}
                             >
                                     <Select
                                             defaultValue="PointToPoint"
                                             style={{width: '100%'}}
                                     >
                                             <Option value="PointToPoint">Point To Point</Option>
                                             <Option value="PointToPlane">Point To Plane</Option>
                                     </Select>
     
                     </Form.Item>
                  </Form>
                </Form>
    )
}
export const ClusteredRobustIcpPoseEstimator = ({socketInstance, handleDetectorData,detectorInputPointCloud,setViewPcdCenterX,setViewPcdCenterY,
        setViewPcdCenterZ,setFilterRadius}) => {

        const [localICPEnabled, setLocalICPEnabled] = useState(false);
        // const [alphaFilteringEnabled, setAlphaFilteringEnabled] = useState(false);


        const handleValuesChange = (changedValues, allValues) => {
                console.log('Assign Values:', allValues);
                setViewPcdCenterX(allValues["center_x"])
                setViewPcdCenterY(allValues["center_y"])
                setViewPcdCenterZ(allValues["center_z"])
                setFilterRadius(allValues["filter_radius"])
                handleDetectorData(allValues);
                // socketInstance.emit('SetupDetector', mergedData);
                // console.log('Setup Detector data is sent: ', mergedData);
            };

        const [form] = Form.useForm();
        

       
              
              
        return (
                <Form 
                  form={form}
                  onValuesChange={handleValuesChange}
                  layout="horizontal"
                  labelCol={{
                    span: 12,
                  }}
                  wrapperCol={{
                    span: 32,
                  }}
                  style={{width: '100%'}}
              >
                  <Form.Item label="Name" name="name" initialValue={"Clustered Robust ICP Pose Estimator"}>
                  <Input style={{width: '100%'}} />
                  </Form.Item>
                  
                  <Form.Item label="Product" name="product_name" initialValue={""}>
                      <Input style={{width: '100%'}} />
                  </Form.Item>
  
                  <Divider>Passthrough Filter</Divider>
                  
                  <Form.Item label="Point Cloud Center X:" name="center_x" initialValue={0}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  <Form.Item label="Y:" name="center_y" initialValue={0}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  <Form.Item label="Z:" name="center_z" initialValue={0}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  <Form.Item label="Passthrough Filter Radius" name="filter_radius" initialValue={150}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
                  
  
                  <Divider>Voxel Downsampling</Divider>
  
                  <Form.Item label="Voxel Nearest Neighbour" name="voxel_nearest_neighbour" initialValue={16}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
                  
                  <Form.Item label="Standard Deviation Multiplier" name="voxel_std_multiplier" initialValue={10}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  <Form.Item label="Voxel Size" name="voxel_size" initialValue={0.01}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
  
                  <Divider>Ransac Plane filter</Divider>

                  <Form.Item label="Number of Planes" name="filter_max_plane" initialValue={1}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
  
                  <Form.Item label="Distance Threshold" name="filter_distance_threshold" initialValue={1}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  

                  <Divider>Ransac Plane Detection</Divider>
                  <Form.Item label="Number of Planes" name="ransac_detect_max_plane" initialValue={1}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
  
                  <Form.Item label="Distance Threshold" name="ransac_detect_distance_threshold" initialValue={7}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  
  
                  <Divider>DBScan Clustering</Divider>
  
                  <Form.Item label="Distance Threshold" name="dbscan_distance_threshold" initialValue={7}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>

                  <Form.Item label="Minimum Points" name="dbscan_min_points" initialValue={300}>
                      <InputNumber style={{width: '100%'}} />
                  </Form.Item>
  
                  <Divider>Robust ICP Registration</Divider>
                                       
                     <Form
                     form={form}
                     onValuesChange={handleValuesChange}
                     layout="horizontal"
                     labelCol={{
                     span: 12,
                     }}
                     wrapperCol={{
                     span: 32,
                     }}             
                     style={{width: '100%'}}
                  >

                     <Form.Item label="Voxel Size"  name="robust_kernel_voxel_size" initialValue={1}>
                           <InputNumber style={{width: '100%'}} />
                      </Form.Item>
                     <Form.Item label="Distance Threshold"  name="robust_kernel_threshold" initialValue={1}>
                           <InputNumber style={{width: '100%'}} />
                      </Form.Item>

                     <Form.Item label="Iteration" name="robust_kernel_iteration" initialValue={10}>
                           <InputNumber style={{width: '100%'}} />
                     </Form.Item>

                     <Form.Item label="Standard Deviation" name="robust_kernel_std" initialValue={0.5}>
                           <InputNumber style={{width: '100%'}} />
                     </Form.Item>
                     
                     </Form>   

                  <Divider>Local ICP</Divider>
                  <Form.Item
                     name ="local_icp_is_required"
                     valuePropName='checked'
                     initialValue={false}>
                     <Checkbox checked={localICPEnabled}
                     onChange={(e) => setLocalICPEnabled(e.target.checked)}>
                     Local ICP
                     
                     </Checkbox>
                     </Form.Item>
                     
                     <Form
                     form={form}
                     onValuesChange={handleValuesChange}
                     layout="horizontal"
                     labelCol={{
                     span: 12,
                     }}
                     wrapperCol={{
                     span: 32,
                     }}
                     disabled={!localICPEnabled}
             
                     style={{width: '100%'}}
                  >
                     <Form.Item label="Distance Threshold" name="local_icp_max_correspondence_distance" initialValue={15}>
                           <InputNumber style={{width: '100%'}} />
                      </Form.Item>
     
                     <Form.Item label="Iteration" name="local_icp_max_iteration" initialValue={1000}>
                           <InputNumber style={{width: '100%'}} />
                     </Form.Item>
          
                     <Form.Item 
                                     label="ICP Variant" 
                                     name="local_icp_variant" 
                                     layout="horizontal"
                                     labelCol={{
                                             span: 12,
                                     }}
                                     wrapperCol={{
                                             span: 32,
                                     }}
                                     style={{width: '100%'}}
                                     initialValue={"PointToPoint"}
                             >
                                     <Select
                                             defaultValue="PointToPoint"
                                             style={{width: '100%'}}
                                     >
                                             <Option value="PointToPoint">Point To Point</Option>
                                             <Option value="PointToPlane">Point To Plane</Option>
                                     </Select>
     
                     </Form.Item>
                  </Form>
                </Form>
    )
}


export const DetectorEditor = ({socketInstance,
                                detectorInputImageUrl,
                                detectorInputImagesUrls,
                                detectorTreeData,
                                handleDetectorTreeData,
                                selectedDetector,
                                handleSelectedDetector,
                                detectorInputPointCloud,
                                setViewPcdCenterX,
                                setViewPcdCenterY,
                                setViewPcdCenterZ,
                                setFilterRadius,
                                showDetectorData,
                                handleShowDetectorData,
                                productTreeData
                                }) => {
    const [detectorData, setDetectorData] = useState(null);
    

    console.log("Detector Uploaded Image", detectorInputImageUrl)

    const handleDetectorData = (detectorData) =>
    {   if (selectedDetector === "Clustered ICP Pose Estimator" || selectedDetector === "Clustered Ffph ICP Pose Estimator" || selectedDetector === "Clustered Robust ICP Pose Estimator"){
        const data=JSON.parse(JSON.stringify(detectorData))

        data["point_cloud"]="Point Cloud";
        console.log("Detector data ", data) 
        setDetectorData(detectorData);
        }
        else{
        console.log("Detector data ", detectorData) 
        setDetectorData(detectorData);}

    }
    
    const distance = (x, y, z, viewPcdCenterX, viewPcdCenterY, viewPcdCenterZ)  => {
        const center = new THREE.Vector3(viewPcdCenterX, viewPcdCenterY, viewPcdCenterZ);
        const point2 = new THREE.Vector3(x, y, z);
        const distance = center.distanceTo(point2);
        return distance
    }
    const handlePreviewClick = () =>
    {   
        const newDict = { "type": selectedDetector};
        const mergedData = { ...newDict, ...detectorData };
        console.log(detectorData);
        socketInstance.emit('SetupDetector', mergedData );
        console.log('Setup Detector data is sent: ',mergedData );  
    }
 
    const handleSaveDetectorClick = () => {
        socketInstance.emit('SaveDetector', detectorData);
        console.log("save detector trigger sent: ", detectorData)
        // Add the detector data to the detector tree data
        handleDetectorTreeData(detectorData);
        handleShowDetectorData(false);
    }

    const handleCancelClick = () => {
        handleShowDetectorData(false);
    }

    return (
        <div>
                {showDetectorData ? (
                <Flex gap="small" vertical>
                        <Card          
                        size="small"
                        style={{
                        width: '100%', 
                        backgroundColor: '#313131',
                        borderRadius: '10px',
                        padding: '8px'
                        }}
                >
                        <Form.Item 
                                label="Detector Model " 
                                name="codeGenerator" 
                                layout="horizontal"
                                labelCol={{
                                        span: 12,
                                }}
                                wrapperCol={{
                                        span: 32,
                                }}
                                style={{width: '100%'}}
                        >
                                <Select
                                        defaultValue="Deep Learning Detector"
                                        style={{width: '100%'}}
                                        onChange={(value) => handleSelectedDetector(value)}
                                >
                                        <Option value="Deep Learning Detector">Deep Learning Detector</Option>
                                        <Option value="Circle Detector">Circle Detector</Option>
                                        <Option value="Template Matcher">Template Matcher</Option>
                                        <Option value="Generalized Template Matcher">Generalized Template Matcher</Option>
                                        <Option value="SolvePnP Pose Estimator">SolvePnP Pose Estimator</Option>
                                        <Option value="Clustered Sampler ICP Pose Estimator">Clustered Sampler ICP Pose Estimator</Option>
                                        <Option value="Clustered Ffph ICP Pose Estimator">Clustered Ffph ICP Pose Estimator</Option>
                                        <Option value="Clustered Robust ICP Pose Estimator">Clustered Robust ICP Pose Estimator</Option>
                                </Select>

                        </Form.Item>
                        <Divider>Detector Parameters</Divider>

                        {selectedDetector === 'Deep Learning Detector' && <DeepLearningDetector socketInstance={socketInstance} productTreeData={productTreeData}/>}
                        {selectedDetector === 'Circle Detector' && <CircleDetector socketInstance={socketInstance} detectorInputImagesUrls={detectorInputImagesUrls} selectedDetector={selectedDetector} handleDetectorData={handleDetectorData}/>}
                        {selectedDetector === 'SolvePnP Pose Estimator' && <SolvePnPPoseEstimator socketInstance={socketInstance} handleDetectorData={handleDetectorData}/>}
                        {selectedDetector === 'Template Matcher' && <TemplateMatcher socketInstance={socketInstance} detectorInputImagesUrls={detectorInputImagesUrls} selectedDetector={selectedDetector} handleDetectorData={handleDetectorData}/>}
                        {selectedDetector === 'Generalized Template Matcher' && <GeneralizedTemplateMatcher socketInstance={socketInstance} detectorInputImagesUrls={detectorInputImagesUrls} selectedDetector={selectedDetector} handleDetectorData={handleDetectorData}/>}

                        {selectedDetector === 'Clustered Sampler ICP Pose Estimator' && <ClusteredICPPoseEstimator socketInstance={socketInstance} handleDetectorData={handleDetectorData} detectorInputPointCloud={detectorInputPointCloud}setViewPcdCenterX={setViewPcdCenterX} setViewPcdCenterY={setViewPcdCenterY} setViewPcdCenterZ={setViewPcdCenterZ} setFilterRadius={setFilterRadius} />}

                        {selectedDetector === 'Clustered Ffph ICP Pose Estimator' && <ClusteredFfphIcpPoseEstimator socketInstance={socketInstance} handleDetectorData={handleDetectorData} detectorInputPointCloud={detectorInputPointCloud}setViewPcdCenterX={setViewPcdCenterX} setViewPcdCenterY={setViewPcdCenterY} setViewPcdCenterZ={setViewPcdCenterZ} setFilterRadius={setFilterRadius} />}
                        
                        {selectedDetector === 'Clustered Robust ICP Pose Estimator' && <ClusteredRobustIcpPoseEstimator socketInstance={socketInstance} handleDetectorData={handleDetectorData} detectorInputPointCloud={detectorInputPointCloud}setViewPcdCenterX={setViewPcdCenterX} setViewPcdCenterY={setViewPcdCenterY} setViewPcdCenterZ={setViewPcdCenterZ} setFilterRadius={setFilterRadius} />}
                </Card>

                        <Flex gap="small" justify="right">
                                <Button size="small" onClick={handleCancelClick}>Cancel</Button>
                                {(selectedDetector === 'Clustered Sampler ICP Pose Estimator' || selectedDetector === "Clustered Ffph ICP Pose Estimator" || selectedDetector === "Clustered Robust ICP Pose Estimator") && <Button type="primary"
                                        size="small"
                                        onClick={handlePreviewClick} >Preview</Button>}
                                <Button type="primary"
                                        size="small"
                                        onClick={handleSaveDetectorClick} >Save Detector</Button>
                        </Flex>
                </Flex>) : (
                    // 50vh is equal to 50% of the viewport's height, as 100% does not work.
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', width: '100%' }}>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <Typography.Text style={{ color: '#888' }}>
                                    Please add detector by clicking <PlusOutlined style={{ fontSize: '1em' }} /> Add Detector.
                                </Typography.Text>
                            }
                        >
                        </Empty>
                    </div>
                )
                }
        </div>
    )
}

export const DetectorOutliner = ({detectorTreeData, handleShowDetectorData}) => {

    const [isDetectorTreeAdded, setIsDetectorTreeAdded] = useState(false);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [checkedKeys, setCheckedKeys] = useState([]);

    // Define the click handler function
    const handleClick = () => {
        setIsDetectorTreeAdded(true);
        console.log('Adding detector clicked');
        handleShowDetectorData(true);
    }

    // Handle search change
    const onChange = (e) => {
        console.log('Searching detector clicked');
    };

    const treeData = useMemo(() => {
        console.log('Newly assigned detector tree data: ', detectorTreeData);
        if (!detectorTreeData || !Array.isArray(detectorTreeData) || detectorTreeData.length === 0) {
            console.log('Newly assigned detector tree data is null')
            return [];
        }

        const loop = (data) =>
            data.map(item => {
                const strTitle = item.name;
                const title =
                    <span>{strTitle}</span>;
                if (item.children) {
                    return {
                        title,
                        key: item.name,
                        children: loop(item.children),
                    };
                }
                return {
                    title,
                    key: item.name,
                };
            });

        return loop(detectorTreeData);
    }, [detectorTreeData]);

    const onExpand = (newExpandedKeys) => {
        console.log('onExpand', newExpandedKeys);
        setExpandedKeys(newExpandedKeys);
        setAutoExpandParent(false);
    };

    const onCheck = (checkedKeysValue) => {
        console.log('onCheck', checkedKeysValue);
        setCheckedKeys(checkedKeysValue);
    };

    const onSelect = (selectedKeysValue, info) => {
        console.log('onSelect', info);
        setSelectedKeys(selectedKeysValue);
    };

    return (
        <div>
            <Flex gap="small" direction="column" align="center">
                <Flex gap="small" align="start" style={{width: '100%'}}>
                    <Button icon={<PlusOutlined/>}
                            size="small"
                            type="primary"
                            onClick={handleClick}
                    >
                        Add Detector
                    </Button>
                    <Search style={{marginBottom: 8}} size="small" placeholder="Search" onChange={onChange}/>
                </Flex>
            </Flex>

            {isDetectorTreeAdded ? (
                <Tree
                    checkable
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                    onSelect={onSelect}
                    selectedKeys={selectedKeys}
                    treeData={treeData}
                />) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <Typography.Text style={{color: '#888'}}>
                            Please add detector by clicking <PlusOutlined style={{fontSize: '1em'}}/> Add Detector.
                        </Typography.Text>
                    }
                >
                </Empty>
            )}
        </div>
)
}