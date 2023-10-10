export const API_EndPoint = async function (HttpContext) {
    if (!HttpContext.path.isAPI) {
        return false;
    } else {
        let controllerName = HttpContext.path.controllerName;
        if (controllerName != undefined) {
            try {
                // dynamically import the targeted controller
                // if the controllerName does not exist the catch section will be called
                const { default: Controller } = (await import('./controllers/' + controllerName + '.js'));

                // instanciate the controller       
                let controller = new Controller(HttpContext);
                switch (HttpContext.req.method) {
                    case 'GET':
                        //If link has "? and if name has math in it"
                        if(HttpContext.req.url.includes('?') && controllerName == 'MathsController')
                        {
                            let params = HttpContext.path.params;
                            //If no params, redirect to html page from math controller
                            if(Object.keys(params).length == 1)
                            {
                                controller.demonstrateExamples();
                            }
                            else
                            {
                                var str = JSON.stringify(params);
                                str = str.replace("?", '');
                                params = JSON.parse(str);
                                
                                controller.calculate(HttpContext.req, HttpContext.res, params);
                            }
                        }
                        else
                        {
                            controller.get(HttpContext.path.id);
                        }
                        return true;
                    case 'POST':
                        if (HttpContext.payload)
                            controller.post(HttpContext.payload);
                        else
                            HttpContext.response.unsupported();
                        return true;
                    case 'PUT':
                        if (HttpContext.payload)
                            controller.put(HttpContext.payload);
                        else
                            HttpContext.response.unsupported();
                            return true;
                    case 'DELETE':
                        controller.remove(HttpContext.path.id);
                        return true;
                    default:
                        HttpContext.response.notImplemented();
                        return true;
                }
            } catch (error) {
                console.log("API_EndPoint Error message: \n", error.message);
                console.log("Stack: \n", error.stack);
                HttpContext.response.notFound();
                return true;
            }
        } else {
            // not an API endpoint
            // must be handled by another middleware
            return false;
        }
    }
}