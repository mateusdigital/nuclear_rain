
const _WINDOW_RESIZE_TIMEOUT_DURATION = 250;
let _Window_ResizeHandlers          = new Set();
let _Window_ResizeTimeoutId         = null;
let _Window_ResizeCallbackInstalled = false;

function Window_AddResizeHandler(handler)
{
    if(!_Window_ResizeCallbackInstalled) {
        // @todo(stdmatt): Check why with addEventListener the events are not
        // getting propagated...
       // window.addEventListener("resize",
        window.onresize = ()=>{
            clearTimeout(_Window_ResizeTimeoutId);
            _Window_ResizeTimeoutId = setTimeout(()=>{
                for(let curr_handler of _Window_ResizeHandlers) {
                    if(typeof(curr_handler) == "function") {
                        curr_handler();
                    } else {
                        curr_handler.OnWindowResize();
                    }
                }
            }, _WINDOW_RESIZE_TIMEOUT_DURATION);
        }
        _Window_ResizeCallbackInstalled = true;
    }

    _Window_ResizeHandlers.add(handler);
}

function Window_RemoveResizeHandler(handler)
{
    _Window_ResizeHandlers.delete(handler);
}
