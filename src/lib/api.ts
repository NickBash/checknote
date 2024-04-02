export class API {
  public static uploadImage = async (file: File) => {
    await new Promise(r => setTimeout(r, 500))
    return '/placeholder-image.jpg'
  }
}

export default API
