import { useSize } from 'ahooks';

const useIsMobile = (element: Element | null) => {
    const size = useSize(element) || { width: 0, height: 0 };
    const isMobile = size.width < 800;

    return {
        isMobile
    };
};

export default useIsMobile;
