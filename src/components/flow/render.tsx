import { useCallback, type ReactNode } from 'react';
import {
    Handle,
    type NodeProps,
    Position,
    useReactFlow,
    useUpdateNodeInternals,
} from 'reactflow';
import { Card, CardContent } from '../ui/card';
import {
    ContextMenuItem,
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
    ContextMenuCheckboxItem,
    ContextMenuSeparator,
} from '../ui/context-menu';
import { Button } from '../ui/button';
import { cn } from '~/lib/utils';
import { ContextMenuLabel } from '@radix-ui/react-context-menu';

type NodeData = {
    children: ReactNode;
    target: boolean;
    source: boolean;
};

const handleStyle = { left: 0, top: '50%' };

const RenderNode = ({ data, id }: NodeProps<NodeData>) => {
    const updateNodeInternals = useUpdateNodeInternals();
    const { getNode, setNodes, addEdges, setEdges } = useReactFlow();
    const deleteNode: () => void = useCallback(() => {
        setNodes(nodes => nodes.filter(node => node.id !== id));
        setEdges(edges => edges.filter(edge => edge.source !== id));
    }, [id, setNodes, setEdges]);

    const updateNode: (target: boolean, source: boolean) => void = useCallback(
        (target, source) => {
            setNodes(nodes => {
                return nodes.map(node => {
                    if (node.id == id) {
                        if (target == false) {
                            setEdges(edges =>
                                edges.filter(edge => edge.target !== id)
                            );
                        }

                        if (source == false) {
                            setEdges(edges =>
                                edges.filter(edge => edge.source !== id)
                            );
                        }

                        return {
                            ...node,
                            data: {
                                ...(node.data as NodeData),
                                target,
                                source,
                            } satisfies NodeData,
                        };
                    }

                    return node;
                });
            });
            updateNodeInternals(id);
        },
        [id, setNodes, setEdges, updateNodeInternals]
    );

    return (
        <>
            <Handle
                type='target'
                position={Position.Left}
                className={cn(!data.target && 'hidden')}
            />

            <ContextMenu>
                <ContextMenuTrigger>
                    <Card className='rounded-sm'>{data.children}</Card>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuLabel>Node Controls</ContextMenuLabel>
                    {/* <ContextMenuItem>Profile</ContextMenuItem>
                    <ContextMenuItem>Billing</ContextMenuItem>
                    <ContextMenuItem>Team</ContextMenuItem> */}
                    {/* <ContextMenuCheckboxItem
                        checked={data.target}
                        onClick={() => updateNode(!data.target, data.source)}
                    >
                        Has Target
                    </ContextMenuCheckboxItem>
                    <ContextMenuCheckboxItem
                        checked={data.source}
                        onClick={() => updateNode(data.target, !data.source)}
                    >
                        Has Source
                    </ContextMenuCheckboxItem> */}
                    <ContextMenuSeparator />
                    <ContextMenuItem className='p-0'>
                        <Button
                            type='button'
                            variant={'destructive'}
                            className='w-full'
                            onClick={deleteNode}
                        >
                            Delete
                        </Button>
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
            <Handle
                type='source'
                position={Position.Right}
                className={cn(!data.source && 'hidden')}
            />
        </>
    );
};

export default RenderNode;
