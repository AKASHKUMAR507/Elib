import { v2 as cloudinary} from 'cloudinary';
import { config } from './config';

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
})

export default cloudinary;

/**
 * 
 import { v2 as cloudinary } from 'cloudinary';

(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: '', 
        api_key: '', 
        api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
    });
    
    // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(
           'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
               public_id: 'shoes',
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url('shoes', {
        fetch_format: 'auto',
        quality: 'auto'
    });
    
    console.log(optimizeUrl);
    
    // Transform the image: auto-crop to square aspect_ratio
    const autoCropUrl = cloudinary.url('shoes', {
        crop: 'auto',
        gravity: 'auto',
        width: 500,
        height: 500,
    });
    
    console.log(autoCropUrl);    
})();

useEffect(() => {
    const ac = new AbortController();
    const {signal} = ac;

    window.addEventListener("load", handleLoad, { signal })
    window.addEventListener("click", handleLoad, { signal })
    window.addEventListener("scroll", handleLoad, { signal })
    window.addEventListener("keyDown", handleLoad, { signal })

    return () => {
        ac.abort();
    }
}, [])
 */