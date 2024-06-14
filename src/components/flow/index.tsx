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
    NodeChange,
    OnInit,
    ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '../ui/button';
import {
    DragEventHandler,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
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
import { useDebouncedState, useHotkeys } from '@mantine/hooks';
import NodeDrawer from './nodeDrawer';

const fitViewOptions: FitViewOptions = {
    padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
    animated: true,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

function Flow() {
    const [showNodeDrawer, enableNodeDrawer] = useState(false);

    const [editCount, setEditCount] = useDebouncedState(1, 200);

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
                    parentId: '4',
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
                    position: { x: 200, y: 0 },
                    type: 'outbound',
                },
                {
                    id: '4',
                    data: {
                        source: false,
                        target: false,
                        children: <>test</>,
                    },
                    position: {
                        x: 400,
                        y: 0,
                    },
                    type: 'render',
                    extent: 'parent',
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

    const [undoNodeHistory, setUndoNodeHistory] = useState<NodeChange[][]>([]);
    const [redoNodeHistory, setRedoNodeHistory] = useState<NodeChange[][]>([]);
    const [reactFlowInstance, setReactFlowInstance] =
        useState<ReactFlowInstance<any, any> | null>(null);

    const onDragOver = useCallback<DragEventHandler<HTMLDivElement>>(event => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback<DragEventHandler<HTMLDivElement>>(
        event => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
            // and you don't need to subtract the reactFlowBounds.left/top anymore
            // details: https://reactflow.dev/whats-new/2023-11-10
            const position = reactFlowInstance?.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            if (!position) return;

            const newNode: Node = {
                id: getId(),
                type,
                position,
                data: { label: `${type} node` },
            };

            setNodes(nds => nds.concat(newNode));
        },
        [reactFlowInstance]
    );

    const onNodesChange: OnNodesChange = useCallback(
        changes => {
            console.log(editCount, undoNodeHistory.length);
            if (
                changes.length == 1 &&
                changes[0]?.type == 'position' &&
                editCount == undoNodeHistory.length
            ) {
                setEditCount(state => state + 1);
                setUndoNodeHistory(tempHistory => {
                    const temp = [...tempHistory];
                    temp[temp.length - 1]?.push(...changes);
                    return temp;
                });
            } else {
                console.log('else');
                setUndoNodeHistory(history => [...history, changes]);
                setEditCount(state => state + 1);
            }
            setNodes(nds => applyNodeChanges(changes, nds));
        },
        [setNodes, editCount, undoNodeHistory, setEditCount]
    );
    const onEdgesChange: OnEdgesChange = useCallback(
        changes => setEdges(eds => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const onConnect: OnConnect = useCallback(
        connection => setEdges(eds => addEdge(connection, eds)),
        [setEdges]
    );

    console.log(undoNodeHistory, editCount, undoNodeHistory.length);

    useHotkeys([
        ['ctrl+space', () => enableNodeDrawer(state => !state)],
        [
            'ctrl+z',
            () => {
                if (undoNodeHistory.length == 1) {
                    return;
                }
                const undo = [...undoNodeHistory];
                const node = undo.pop();
                if (node) {
                    setRedoNodeHistory(state => [...state, node]);
                }
                setNodes(initialNodes);
                setEdges(initialEdges);
                onNodesChange(undo.flat());
                setUndoNodeHistory(undo);
                setEditCount(undoNodeHistory.length);
            },
        ],
        [
            'ctrl+shift+z',
            () => {
                if (redoNodeHistory.length == 0) return;
                const redo = [...redoNodeHistory];
                const node = redo.pop();
                if (node) {
                    onNodesChange(node);
                }
                setRedoNodeHistory(redo);
                setEditCount(undoNodeHistory.length + 2);
            },
        ],
    ]);

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
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                proOptions={{
                    hideAttribution: true,
                }}
            >
                <Background />
                {/* <Controls /> */}
                <div
                    className={cn(
                        'bottom-0 absolute ease-in-out duration-300 w-full px-4 pointer-events-non z-50 h-80',
                        showNodeDrawer ? '-translate-y-4' : 'translate-y-full'
                    )}
                >
                    <NodeDrawer />
                </div>
            </ReactFlow>
            <div className='flex gap-2'>
                <Button onClick={() => enableNodeDrawer(state => !state)}>
                    Node Drawer
                </Button>
            </div>
        </div>
    );
}

export default Flow;
