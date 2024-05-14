'use client';

import ReactFlow, {
    Controls,
    Background,
    applyNodeChanges,
    applyEdgeChanges,
    type Edge,
    type Node,
    type OnNodesChange,
    type OnEdgesChange,
    type OnConnect,
    addEdge,
    type FitViewOptions,
    type DefaultEdgeOptions,
    type NodeTypes,
    ConnectionLineType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '../ui/button';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CustomNode from './customNode';
import RenderNode from './render';
import InputNode from './inputNode';
import OutputNode from './outputNode';
import { Label } from '../ui/label';
import { cn } from '~/lib/utils';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { createPortal } from 'react-dom';
import { TourProvider, useTourContext } from '../tour';

const fitViewOptions: FitViewOptions = {
    padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
    animated: true,
};

const TourUser = () => {
    const ctx = useTourContext();

    const buttonOne = useRef<HTMLButtonElement>(null);
    const buttonTwo = useRef<HTMLButtonElement>(null);
    console.log(ctx);
    useEffect(() => {
        ctx.nodes.set('button1', {
            ref: buttonOne.current as HTMLElement,
            render: (
                <Card>
                    <CardTitle>
                        {ctx.current == 1 ? '???' : 'Node Drawer'}
                    </CardTitle>
                    <CardContent>helpful content</CardContent>
                    <CardFooter>
                        <Button onClick={() => ctx.previous()}>previous</Button>
                        <Button onClick={() => ctx.next()}>next</Button>
                    </CardFooter>
                </Card>
            ),
        });
        ctx.nodes.set('button2', {
            ref: buttonTwo.current as HTMLElement,
            render: (
                <Card>
                    <CardTitle>
                        {ctx.current == 1 ? '???' : 'Node Drawer'}
                    </CardTitle>
                    <CardContent>helpful content</CardContent>
                    <CardFooter>
                        <Button onClick={() => ctx.previous()}>previous</Button>
                        <Button onClick={() => ctx.next()}>next</Button>
                    </CardFooter>
                </Card>
            ),
        });
    }, []);

    return (
        <>
            <div className='flex gap-2'>
                <Button
                    // onClick={() => enableNodeDrawer(state => !state)}
                    ref={buttonOne}
                >
                    Node Drawer
                </Button>
                <Button ref={buttonTwo}>???</Button>
                <Button onClick={() => ctx.open()}>Tour</Button>
            </div>
        </>
    );
};

function Flow() {
    const [showNodeDrawer, enableNodeDrawer] = useState(false);

    const nodeTypes = useMemo(
        () =>
            ({
                custom: CustomNode,
                render: RenderNode,
                inbound: InputNode,
                outbound: OutputNode,
            }) satisfies NodeTypes,
        []
    );

    const initialNodes = useMemo(
        () =>
            [
                {
                    id: '1',
                    data: { children: <Label className='m-2'>Hello</Label> },
                    position: { x: 0, y: 0 },
                    type: 'inbound',
                },
                {
                    id: '2',
                    data: { children: <Button className='m-2'>World</Button> },
                    position: { x: 100, y: 100 },
                    type: 'render',
                },
                {
                    id: '3',
                    data: { children: <Button className='m-2'>World</Button> },
                    position: { x: 0, y: 0 },
                    type: 'outbound',
                },
                {
                    id: '3',
                    data: { children: <Button className='m-2'>World</Button> },
                    position: { x: 0, y: 0 },
                    type: 'outbound',
                },
            ] satisfies Node<
                Parameters<
                    (typeof nodeTypes)[keyof typeof nodeTypes]
                >[0]['data'],
                keyof typeof nodeTypes
            >[],
        []
    );

    const initialEdges = useMemo(
        () =>
            [
                {
                    id: '1-3',
                    source: '1',
                    target: '3',
                    label: 'to the',
                },
            ] satisfies Edge[],
        []
    );
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onNodesChange: OnNodesChange = useCallback(
        changes => setNodes(nds => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange: OnEdgesChange = useCallback(
        changes => setEdges(eds => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const onConnect: OnConnect = useCallback(
        connection => setEdges(eds => addEdge(connection, eds)),
        [setEdges]
    );

    return (
        <div className='flex h-full flex-col'>
            {/* {tour &&
                createPortal(
                    <div
                        id='tour'
                        className='pointer-events-auto w-screen h-screen fixed top-0 left-0'
                    >
                        <Card
                            className='absolute -top-8 z-50 transition-all ease-in-out duration-500'
                            style={{
                                left: getCurrent()?.getBoundingClientRect().x,
                                top:
                                    getCurrent()?.getBoundingClientRect().y -
                                    100,
                            }}
                        >
                            <CardTitle>
                                {current == 1 ? '???' : 'Node Drawer'}
                            </CardTitle>
                            <CardContent>helpful content</CardContent>
                            <CardFooter>
                                <Button
                                    onClick={() =>
                                        setCurrent(state =>
                                            state == 1 ? 0 : 1
                                        )
                                    }
                                >
                                    swap
                                </Button>
                            </CardFooter>
                        </Card>
                        <div
                            className={`overflow-hidden opacity-80 w-screen h-screen absolute z-40 shadow-fill transition-all ease-in-out duration-500`}
                            style={{
                                height: getCurrent()?.getBoundingClientRect()
                                    .height,
                                width: getCurrent()?.getBoundingClientRect()
                                    .width,
                                left: getCurrent()?.getBoundingClientRect().x,
                                top: getCurrent()?.getBoundingClientRect().y,
                            }}
                        >
                        </div>
                    </div>,
                    document.body
                )} */}
            <ReactFlow
                nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                fitViewOptions={fitViewOptions}
                defaultEdgeOptions={defaultEdgeOptions}
                connectionLineType={ConnectionLineType.SimpleBezier}
                nodeTypes={nodeTypes}
                proOptions={{
                    hideAttribution: true,
                }}
            >
                <Background />
                {/* <Controls /> */}
                <div
                    className={cn(
                        'bottom-0 absolute ease-in-out duration-300 w-full px-4 pointer-events-non z-50',
                        showNodeDrawer ? '-translate-y-4' : 'translate-y-full'
                    )}
                >
                    <Card className={cn('rounded-sm w-full p-2 z-50')}>
                        <CardHeader className='pb-2'>
                            <CardTitle>Node Drawer</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs
                                orientation='vertical'
                                defaultValue='default'
                                className='flex gap-2'
                            >
                                <TabsList data-orientation='vertical'>
                                    <TabsTrigger value='default'>
                                        Default
                                    </TabsTrigger>
                                    <TabsTrigger value='test'>test</TabsTrigger>
                                    <TabsTrigger value='reee'>reee</TabsTrigger>
                                </TabsList>
                                <TabsContent value='default'>Input</TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </ReactFlow>
            <TourProvider>
                <TourUser />
            </TourProvider>
        </div>
    );
}

export default Flow;
