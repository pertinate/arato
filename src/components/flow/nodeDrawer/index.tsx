import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { cn } from '~/lib/utils';
import { DragEvent } from 'react';

const NodeDrawer = () => {
    const onDragStart = (
        event: DragEvent<HTMLDivElement>,
        nodeType: string
    ) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };
    return (
        <Card className={cn('rounded-sm w-full p-2 z-50 h-full')}>
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
                        <TabsTrigger value='default'>Default</TabsTrigger>
                        <TabsTrigger value='test'>test</TabsTrigger>
                        <TabsTrigger value='reee'>reee</TabsTrigger>
                    </TabsList>
                    <TabsContent value='default'>
                        <div
                            className='dndnode input'
                            onDragStart={event => onDragStart(event, 'input')}
                            draggable
                        >
                            Input Node
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default NodeDrawer;
