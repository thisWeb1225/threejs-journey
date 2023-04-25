# Materials 材質
Materials 是用來給幾何體的每個可見圖元上色的。 其中的演算法程式成為shaders。 我們暫時不學習如何寫 shaders，我們先使用內置的 materials，具體可以參考文檔 

## MeshBasicMaterial 基礎網格材質
一個以簡單著色（平面或線框）方式來繪製幾何體的材質。
這種材質不受光照的影響。

### map 顏色貼圖

先將上次學到的 Texture 載入
```js
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('../assets/textures/door/color.jpg')
```

map 顏色貼圖，用於添加紋理貼圖， 紋理添加可以使用2種方式。
直接在構造函數中傳入
const material = new THREE.MeshBasicMaterial({
  map: doorColorTexture,
})

後續修改屬性
```js
const material = new THREE.MeshBasicMaterial()
material.map = doorColorTexture
```

### color
材質的顏色（Color），預設值為白色 （0xffffff）。
```js
const material = new THREE.MeshBasicMaterial()
material.color = new THREE.Color('#ff0fff')
```

也有多種設置顏色的方式

```js
//empty constructor - will default white
const color1 = new THREE.Color();

//Hexadecimal color (recommended)
const color2 = new THREE.Color( 0xff0000 );

//RGB string
const color3 = new THREE.Color("rgb(255, 0, 0)");
const color4 = new THREE.Color("rgb(100%, 0%, 0%)");

//X11 color name - all 140 color names are supported.
//Note the lack of CamelCase in the name
const color5 = new THREE.Color( 'skyblue' );

//HSL string
const color6 = new THREE.Color("hsl(0, 100%, 50%)");

//Separate RGB values between 0 and 1
const color7 = new THREE.Color( 1, 0, 0 );
```

如果結合 texture 和 color 將會疊加

```js
const material = new THREE.MeshBasicMaterial()
material.map = doorColorTexture
material.color = new THREE.Color('#009688')
```

### wireframe
設定 wireframe 會讓 material 出現框線，我覺得用框線有一種未來感

```js
const material = new THREE.MeshBasicMaterial()
material.wireframe = true
```


### opacity and transparent
如果要設定透明度，需要先將 `transparent` 設定為 `true`，但這對渲染有影響，因為透明物件需要特殊處理。
```js
const material = new THREE.MeshBasicMaterial()
material.transparent = true
material.opacity = 0.5
```

### alphaMap
`.alphaMap : Texture`

alpha貼圖是一張灰度紋理，用於控制整個表面的不透明度。 （黑色：完全透明; 白色：完全不透明）。 預設值為 null。類似 photoshop 的遮罩。

```js
const material = new THREE.MeshBasicMaterial()
material.map = doorColorTexture
material.transparent = true
material.alphaMap = doorAlphaTexture
```

可以看到 alphaMap 的黑色部分疊加到 map 上的的紋理部分透明了。

### side
定義將要渲染哪一面 - 正面，背面或兩者。 預設為 `THREE.FrontSide`。 其他選項有 `THREE.BackSide` 和 `THREE.DoubleSide`。

如果要將相機放在一個立方體內，看其內部，例如現在比較流行的3d看房，那麼就需要將其設置為 `THREE.BackSide`。
要注意的是，`THREE.DoubleSide` 盡量不要使用，因為會給 GPU 帶來更多大壓力，

```js
const material = new THREE.MeshBasicMaterial()
material.side = THREE.BackSide
```

## MeshNormalMaterial 法線網格材質
一種把法向量映射到 RGB 顏色的材質。 詳見文檔 MeshNormalMaterial，法向量總是從物體的外表面向外輻射。

```js
const material = new THREE.MeshNormalMaterial()
```

我們列印球體的屬性，可以看到法向量變數
```js
console.log(sphere.geometry.attributes)
```

法線可以用於光照、反射、折射等，所以 MeshNormalMaterial 材質自身也具有一定的光學特性。  

與 MeshBasicMaterial 類似也具有 wireframe， transparent， opacity， side 屬性。 不過還擁有一個 flatShading 屬性。

### flatShading
定義材質是否使用平面著色進行渲染。 默認值為 false。 設置為 true 后，一位置頂點之間由平面連接，不會再進行頂點之間的法線插值了：

```js
const material = new THREE.MeshNormalMaterial()
material.flatShading = true
```
MeshNormalMaterial 通常用於 debug 法線。


### MeshMatcapMaterial

MeshMatcapMaterial 由一個材質捕捉（MatCap，或光照球（Lit Sphere））紋理所定義，其編碼了材質的顏色與明暗。
MeshMatcapMaterial 不對燈光作出反應。它會直接投射陰影到一個接受陰影的物體上（and shadow clipping works），但不會產生自身陰影或是接受陰影。

```js
const matcapTexture = textureLoader.load('../assets/textures/matcaps/1.png')
const material = new THREE.MeshMatcapMaterial()
material.matcap = matcapTexture
```

在這裡可以找到非常多的 matcap 紋理素材 [https://github.com/nidorx/matcaps](https://github.com/nidorx/matcaps)

### MeshDepthMaterial 深度網格材質
一種按深度繪製幾何體的材質。 深度基於相機遠近平面。 白色最近，黑色最遠。
```js
const material = new THREE.MeshDepthMaterial()
```

這個材質可以被用來創建霧中在環境等場景

接下來的材質都具有光學特性，所以我們先加一些光照
```js
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight('#ffffff', 1, 100)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)
```

### MeshLambertMaterial（Lambert網格材質）

一種非光澤表面的材質，沒有鏡面高光。該材質使用基於非物理的 Lambertian 模型來計算反射率。 這可以很好地類比一些表面（例如未經處理的木材或石材），但不能類比具有鏡面高光的光澤表面（例如塗漆木材）。

由於反射率和光照模型的簡單性，MeshLambertMaterial 是所有受光照材質中性能最好的，但是其犧牲了精度，離近看可以看到一些奇怪的紋理。
```js
const material = new THREE.MeshDepthMaterial()

```
### MeshPhongMaterial（Phong網格材質）
MeshPhongMaterial 與 MeshLambertMaterial 相似。 但表面奇怪的紋理有所減少，並且可以在幾何體表面看到光的反射。

該材質使用非物理的Blinn-Phong模型來計算反射率。 與 MeshLambertMaterial 中使用的 Lambertian 模型不同，該材質可以類比具有鏡面高光的光澤表面（例如塗漆木材）且精度更高。

使用Phong著色模型計算著色時，會計算每個圖元的陰影（在fragment shader， AKA pixel shader中），與MeshLambertMaterial使用的 Gouraud 模型相比，該模型的結果更準確，但代價是犧牲一些性能。 MeshStandardMaterial和MeshPhysicalMaterial也使用這個著色模型。

MeshPhongMaterial 的性能會稍差與 MeshLambertMaterial，但是影響並不大。
```js
const material = new THREE.MeshLambertMaterial()
```
* .shininess : Float
* .specular 高亮的程度，越高的值越閃亮。 預設值為 30。
* .specular : Color

材質的高光顏色。 默認值為0x111111（深灰色）的顏色Color。
```js
const material = new THREE.MeshPhongMaterial()
material.shininess = 60
material.specular = new THREE.Color('#00ff00')
```

### MeshToonMaterial 卡通風格
MeshToonMaterial 的屬性與 MeshLambertMaterial 類似，不過是卡通風格

默認是2個顏色階梯（一個是陰影，一個是高亮）。 如果想增加更多顏色階梯，可以使用 gradientMap 和增加一個紋理
如下圖，是一個 3*1 px 的非常小的灰階圖片

```js
const gradientTexture = textureLoader.load('../assets/textures/gradients/3.jpg')
const material = new THREE.MeshToonMaterial()
material.gradientMap = gradientTexture
```

由於提供的紋理圖片太小，放大濾鏡演算法需要重新指定，這樣就可以看到 3 色灰階了
```js
const gradientTexture = textureLoader.load('../assets/textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter
const material = new THREE.MeshToonMaterial()
material.gradientMap = gradientTexture
```


## MeshStandardMaterial（標準網格材質）
MeshStandardMaterial 是基於物理渲染的（physically based rendering， PBR）。 它支援光效，並有一個更擬真的演算法，支援了更多參數如粗糙度、金屬性。
之所以是 Standard 因為 PBR 已經在很多軟體、引擎和庫里成為一種標準。
這種方法與舊方法的不同之處在於，不使用近似值來表示光與表面的相互作用，而是使用物理上正確的模型。 我們的想法是，不是在特定照明下調整材質以使其看起來很好，而是可以創建一種材質，能夠“正確”地應對所有光照場景。
在實踐中，該材質提供了比MeshLambertMaterial 或MeshPhongMaterial 更精確和逼真的結果，代價是計算成本更高。
計算著色的方式與MeshPhongMaterial相同，都使用Phong著色模型， 這會計算每個圖元的陰影（即在fragment shader， AKA pixel shader中）， 與MeshLambertMaterial使用的Gouraud模型相比，該模型的結果更準確，但代價是犧牲一些性能。
```js
const material = new THREE.MeshStandardMaterial()
```

.metalness : Float  
材質與金屬的相似度。 非金屬材質，如木材或石材，使用0.0，金屬使用1.0，通常沒有中間值。 預設值為0.0。 0.0到1.0之間的值可用於生鏽金屬的外觀。 如果還提供了metalnessMap，則兩個值相乘。
.roughness : Float  
材質的粗糙程度。 0.0表示平滑的鏡面反射，1.0表示完全漫反射。 預設值為1.0。 如果還提供roughnessMap，則兩個值相乘。

.map : Texture  
顏色貼圖。 默認為null。 紋理貼圖顏色由漫反射顏色.color調節。
material.map = doorColorTexture

.aoMap : Texture  
ambient occlusion map，該紋理的紅色通道用作環境遮擋貼圖。 預設值為null。 aoMap需要第二組UV。

我們先為3個幾何體添加第二組 uv 屬性
```js
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))

console.log(sphere.geometry)


material.aoMap = doorAmbientOcclusionTexture
material.aoMapIntensity = 1
```

.aoMapIntensity : Float  
環境遮擋效果的強度。 預設值為1。 零是不遮擋效果。

.displacementMap : Texture  
位移貼圖會影響網格頂點的位置，與僅影響材質的光照和陰影的其他貼圖不同，移位的頂點可以投射陰影，阻擋其他物件， 以及充當真實的幾何體。 位移紋理是指：網格的所有頂點被映射為圖像中每個圖元的值（白色是最高的），並且被重定位。
```js
material.displacementMap = doorHeightTexture
```
看起來很糟糕，因為我們的幾何體頂點太少導致，並且 displacementMap 預設位移太大導致的。

.displacementScale : Float
位移貼圖對網格的影響程度（黑色是無位移，白色是最大位移）。 如果沒有設置位移貼圖，則不會應用此值。 預設值為1。
```js
material.displacementScale = 0.05
```

.metalnessMap : Texture  
該紋理的藍色通道用於改變材質的金屬度。

.roughnessMap : Texture  
該紋理的綠色通道用於改變材質的粗糙度。

可以使用 metalnessMap 和 roughnessMap 代替 metalness roughness

```js
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
```

看起來反射有些奇怪，這是因為之前設置的 和 屬性依然生效，我們需要將這2 個屬性值設置為預設值metalnessroughness
```js
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
material.metalness = 0
material.roughness = 1
```

.normalMap : Texture  
用於創建法線貼圖的紋理。 RGB值會影響每個圖元片段的曲面法線，並更改顏色照亮的方式。 法線貼圖不會改變曲面的實際形狀，只會改變光照。
使用如下的法線貼圖
```js
material.normalMap = doorNormalTexture
```

效果如下，可以看出材質表面光照效果已經不是平面了，光照射時可以明顯的看到法線起伏的效果

.normalScale : Vector2  
法線貼圖對材質的影響程度。 典型範圍是0-1。 默認值是Vector2設置為（1，1）。
```js
material.normalMap = doorNormalTexture
material.normalScale.set(0.5, 0.5)
```

.alphaMap : Texture  
alpha貼圖是一張灰度紋理，用於控制整個表面的不透明度。 （黑色：完全透明; 白色：完全不透明）。 預設值為null。
我們使用alphaMap圖片為

```js
material.alphaMap = doorAlphaTexture
material.transparent = true
```


至此我們就得到了一個很精緻好看的門，MeshStandardMaterial 的屬性基本也學習的差不多了。

## MeshPhysicalMaterial 物理網格材質
MeshStandardMaterial 的擴展，提供了更高級的基於物理的渲染屬性：

Clearcoat： 有些類似於車漆，碳纖，被水打濕的表面的材質需要在面上再增加一個透明的，具有一定反光特性的面。 而且這個面說不定有一定的起伏與粗糙度。 Clearcoat 可以在不需要重新創建一個透明的面的情況下做到類似的效果。

基於物理的透明度：.opacity屬性有一些限制：在透明度比較高的時候，反射也隨之減少。 使用基於物理的透光性.transmission屬性可以讓一些很薄的透明表面，例如玻璃，變得更真實一些。

高級光線反射： 為非金屬材質提供了更多更靈活的光線反射。

## PointsMaterial
用於粒子效果

## ShaderMaterial and RawShaderMaterial
在創建自己的materials時使用，後續會深入學習。 用於創建shaders

## Environment map
環境貼圖，在幾何體上用於反射出周圍環境的一種紋理貼圖。

使用 6 張圖片，形成一個立方體，所以我們需要使用 CubeTextureLoader 來載入
```js
const envMapTexture = new THREE.CubeTextureLoader()
  .setPath('../assets/textures/environmentMaps/0/')
  .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.envMap = envMapTexture
```

可以調節 metalness 和 roughness 觀察變化。 能夠看到反射的不同效果。

## 在哪尋找環境貼圖
有個很好的網站 polyhaven.com/ HDRIHaven 是免費的並且使用了 CC0 license
下載了 hdr 圖片檔后，可以在 matheowis.github.io/HDRI-to-Cub... 在線轉換為6張 cube map 圖片。

## 小結
本節我們研究了 Three.js 中的基礎材質、法線材質、MatCap 材質、Depth 深度材質，以及與光相關的 Lambert/Phong/Toon/Standard/Physical Material。 剩下了後續粒子動效和 Shader 會細講的 2 個材質。 最後又學習了環境貼圖，類比物體金屬反光的效果。

