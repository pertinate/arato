import React, {
    LegacyRef,
    RefAttributes,
    RefObject,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '~/lib/utils';
import { Button } from './ui/button';
import { Card, CardTitle, CardContent, CardFooter } from './ui/card';

export const tourContext = createContext({
    nodes: [] as HTMLElement[],
    show: false,
    current: 0,
    setCurrent: (number: number) => {
        console.log('empty');
    },
    setVisibility: (visible: boolean) => {
        console.log('empty');
    },
    // addNode: (order: number, node: HTMLElement) => {
    //     console.log('empty');
    // },
});

export const useTourContext = () => useContext(tourContext);

export const TourPortal = () => {
    const ctx = useTourContext();
    const ref = useRef<HTMLDivElement>(null);
    const [, updateState] = React.useState({});

    const currentElement = useMemo(() => ctx.nodes[ctx.current], [ctx]);

    useEffect(() => {
        const handleResize = () => {
            updateState({});
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (!currentElement) {
        return <></>;
    }

    const currentElementRect = currentElement.getBoundingClientRect();

    return createPortal(
        <div
            id='tour'
            className={cn(
                'pointer-events-auto w-screen h-screen fixed top-0 left-0',
                !ctx.show ? 'invisible' : 'visible'
            )}
        >
            <div
                ref={ref}
                className='absolute -top-8 z-50 transition-all ease-in-out duration-500'
                style={{
                    left: currentElementRect.x,
                    top:
                        currentElementRect.y -
                        (ref.current?.getBoundingClientRect()?.height ?? 0),
                }}
            >
                <Card>
                    <CardTitle>
                        {ctx.current == 1 ? '???' : 'Node Drawer'}
                    </CardTitle>
                    <CardContent>helpful content</CardContent>
                    <CardFooter>
                        <Button
                            onClick={() =>
                                ctx.setCurrent(ctx.current == 1 ? 0 : 1)
                            }
                        >
                            swap
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <div
                className={`overflow-hidden opacity-80 w-screen h-screen absolute z-40 shadow-fill transition-all ease-in-out duration-500`}
                style={{
                    height: currentElementRect.height,
                    width: currentElementRect.width,
                    left: currentElementRect.x,
                    top: currentElementRect.y,
                }}
            />
        </div>,
        document.body
    );
};

export type TourProps = {
    children?: React.ReactNode;
};

export const TourProvider = (props: TourProps) => {
    const nodes = useRef<HTMLElement[]>([]);
    // const [nodes, setNodes] = useState(
    //     new Map() as ReturnType<typeof useTourContext>['nodes']
    // );
    const [show, setShow] = useState(false);
    const [current, setCurrent] = useState(0);

    return (
        <tourContext.Provider
            value={{
                nodes: nodes.current,
                current,
                show,
                setCurrent: (index: number) => setCurrent(index),
                setVisibility: visible => {
                    setShow(visible);
                },
            }}
        >
            {props.children}
            <TourPortal />
        </tourContext.Provider>
    );
};
