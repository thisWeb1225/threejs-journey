# 6. texture 紋理

## 前言
紋理是覆蓋在幾何體上的圖片，能用特定的方式將紋理映射到物體表面上，使其看上去更真實

## PBR
PBR 原則是基於物理的渲染（Physically Based Rendering），基於與現實世界的物理原理更相符的基本理論所構成的渲染技術。 PBR 已經成為一種標準，很多設計軟體和庫都在使用，如 Three.js， Blender 等

## UV unwrapping
UV unwrapping 是纹理在被放置在模型上的具体对应位置的控制，控制纹理拉伸的位置和方向等。

而 UV 映射是在三維建模中將2D圖像投影到3D表面以進行紋理映射的過程。
![label](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2479de5e7b094c96aefa2d503de9f605~tplv-k3u1fbpfcp-zoom-in-crop-mark%3A4536%3A0%3A0%3A0.awebp)
字母U和V用來表示紋理貼圖上的坐標軸，因為XYZ已經用於表示三維空間中對象的坐標軸，而W（除了XYZ外）用於計算四元數，這是在電腦圖形學中的常見操作。

可以打印出 uv 座標:
```js
const box = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
  map: colorTexture,
})
console.log(box.attributes.uv)
```
其中 array 為 Float32Array，uv 座標兩兩一組，另一個屬性 itemSize 為 2 也是說明這一點。 這些uv座標描述了紋理是如何放置在幾何體表面的。
上面的UV座標是Threejs生成的。 如果你創建自己的幾何體，也需要自己明確 UV 座標。 如果你使用其他 3d 軟體創建幾何體，也需要在軟體中設置 UV 展開後的貼圖與模型的 UV 座標。

## Transforming the Texture 紋理變換
### repeat 重複
給紋理設置如下屬性
```js
const colorTexture = textureLoader.load('../assets/textures/door/color.jpg')

colorTexture.repeat.x = 2
colorTexture.repeat.y = 3
```

可以看到並沒有 repeat，而是邊緣的圖元被拉伸了，需要再設置屬性
```js
const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('../assets/textures/door/color.jpg')

colorTexture.repeat.x = 2
colorTexture.repeat.y = 3
colorTexture.wrapS = THREE.RepeatWrapping
colorTexture.wrapT = THREE.RepeatWrapping
```

其中 用於指定包裹模式wrapS
.wrapS : number 這個值定義了紋理貼圖在水準方向上將如何包裹，在UV映射中對應於U。
默認值是 ，即紋理邊緣將被推到外部邊緣的紋素。 其他的兩個選項分別是 和 。THREE.ClampToEdgeWrappingTHREE.RepeatWrappingTHREE.MirroredRepeatWrapping

* ClampToEdgeWrapping 是預設值，紋理中的最後一個圖元將延伸到網格的邊緣
* RepeatWrapping，紋理將簡單地重複到無窮大。
* MirroredRepeatWrapping， 紋理將重複到無窮大，在每次重複時將進行鏡像

.wrapT : number 這個值定義了紋理貼圖在垂直方向上將如何包裹，在UV映射中對應於 V。
可以使用與 相同的選項。.wrapS : number
詳見文檔 Texture
MirroredRepeatWrapping 效果如下
colorTexture.wrapS = THREE.MirroredRepeatWrapping
colorTexture.wrapT = THREE.MirroredRepeatWrapping

### offset 偏移
colorTexture.offset.x = 0.5
colorTexture.offset.y = 0

### rotation 旋轉
colorTexture.wrapS = THREE.RepeatWrapping
colorTexture.wrapT = THREE.RepeatWrapping
colorTexture.rotation = Math.PI / 4

### 更改旋轉中心
colorTexture.wrapS = THREE.RepeatWrapping
colorTexture.wrapT = THREE.RepeatWrapping
colorTexture.center = new THREE.Vector2(0.5, 0.5)
colorTexture.rotation = Math.PI / 4

## Filtering and Mipmapping

觀察上述gif動畫，可以看出，立方體上表面角度較平的時候，紋理圖片被模糊化了，正對我們時又變得清晰。 這就是 Filtering and Mipmapping 所做的事情。

在計算機圖形學中，材質過濾（Texture filtering）是一種針對一個使用材質貼圖的圖元，使用臨近的一個或多個紋素計算其紋理顏色的方法。 從數學上來說，材質過濾是抗鋸齒的一種，但它更著重於濾掉材質中的高頻，而不像其他抗鋸齒技術那樣著重於改善邊界顯示效果。 簡單來說，它使得同一個材質可以被用於不同的形狀，尺寸和角度，同時儘可能減少顯示時的模糊和閃爍。
在三維計算機圖形的貼圖渲染中有一個常用的技術被稱為Mipmapping。 為了加快渲染速度和減少圖像鋸齒，貼圖被處理成由一系列被預先計算和優化過的圖片組成的檔， 這樣的貼圖被稱為 MIP map 或者 mipmap。 這個技術在三維遊戲中被非常廣泛的使用。 “MIP”來自於拉丁語 multum in parvo 的首字母，意思是“放置很多東西的小空間”。 Mipmap 需要佔用一定的記憶體空間，同時也遵循小波壓縮規則 （wavelet compression）。

可以理解為Mipmapping會預先生成一系列圖片，在物體旋轉時，不同的角度看到不同的圖片，用於提高性能，空間換時間。

### Minification filter 縮小濾鏡
縮小濾鏡（Minification Filters）詳見文檔 Textures

* THREE. NearestFilter 返回與指定紋理座標（在曼哈頓距離之內）最接近的紋理元素的值
* THREE. NearestMipmapNearestFilter
* THREE. NearestMipmapLinearFilter
* THREE. LinearFilter
* THREE. LinearMipmapNearestFilter 
默認值，它選擇與被紋理化圖元的尺寸最接近的兩個mipmap， 並以LinearFilter為標準來從每個mipmap中生成紋理值。 最終的紋理值是這兩個值的加權平均值。


THREE. LinearMipmapLinearFilter

這些常量用於紋理的 minFilter 屬性，它們定義了當被紋理化的圖元映射到大於1紋理元素（texel）的區域時，將要使用的紋理縮小函數。

### minFilter
當一個紋素覆蓋小於一個圖元時，貼圖將如何採樣。 預設值為， 它將使用 mipmapping 以及三次線性濾鏡。THREE.LinearMipmapLinearFilter

這些過濾演算法背後非常複雜，我們試一下 NearestFilter 來看看實際效果
```js
const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('../assets/textures/door/color.jpg')

colorTexture.minFilter = THREE.NearestFilter // 清晰锐利

const box = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
  map: colorTexture,
})

// Object
const cubeMesh = new THREE.Mesh(box, material)
scene.add(cubeMesh)
```
效果如下，可以看到頂部紋理圖片變得清晰銳利

接下來我們使用另一個紋理貼圖看看效果
使用 1024*1024 的棋盤格子圖片
```js
const colorTexture = textureLoader.load('../assets/textures/checkerboard-1024x1024.png')
colorTexture.minFilter = THREE.NearestFilter
```
可以看到非常多的摩爾紋

這種場景可以嘗試更換不同的 minFilter 去解決
Magnification filter 放大濾鏡

THREE. NearestFilter
THREE. LinearFilter 預設值

這些常量用於紋理的magFilter屬性，它們定義了當被紋理化的圖元映射到小於或者等於1紋理元素（texel）的區域時，將要使用的紋理放大函數。
我們換一個紋理素材 8*8 的非常小的一張棋盤格子圖片

預設值 THREE. LinearFilter 的效果如下
```js
const colorTexture = textureLoader.load('../assets/textures/checkerboard-8x8.png')
```

設置為 NearestFilter 的效果如下
```js
const colorTexture = textureLoader.load('../assets/textures/checkerboard-8x8.png')
colorTexture.magFilter = THREE.NearestFilter
```

當我們使用非常小的紋理時，這個放大濾鏡就顯得非常有用了
再看一組對比 minecraft 風格的立方體
小貼圖為














magFilter 為 LinearFilter （預設）magFilter 為 NearestFilter
另外在放大濾鏡下 NearestFilter 的性能也會更好。
使用 這個屬性會禁止生成 Mipmaps，縮小過濾和放大過濾都會預設為 NearestFilter。colorTexture.generateMipmaps = false
紋理的格式與優化
體積

* jpg 較大的失真壓縮，但體積更小
* png 較小的失真壓縮，但體積更大

同時可以使用 tinyPng 工具進行更好的壓縮
## 尺寸
紋理會被存入 GPU 快取中，同時 mipmapping 的時候，會生成近2倍的圖片，因此盡可能讓圖片小。
mipmapping 的操作是不斷的將圖片縮小一倍，直到 1 比 1 圖元，可理解為不停地除以2，所以建議使用 2 的 n 次冪的寬高尺寸圖片，如 512512、10241024、5122048 等，如果不是這樣的尺寸，ThreeJs 也會幫你優化，但可能會帶來額外的性能損耗或渲染問題。
Data
png 支援透明通道，而 jpg 不支援。 如果想擁有1個紋理包含顏色和透明度，最好使用 png。 png 也會包含更多資訊
## 小結
本節我們學習了紋理相關的知識，知道了如何載入紋理，獲取載入進度，瞭解了 uv unwrapping，紋理的變換，放大和縮小濾鏡以及一些簡單的紋理相關的性能優化。 最後附上網上可以找到的比較好的紋理資源網站。 下一節我們將學習研究 Materials 材質。


### Textures 資源
[www.poliigon.com/](https://www.poliigon.com/)  
[3dtextures.me/](https://3dtextures.me/)  
[www.arroway-textures.ch/](https://www.arroway-textures.ch/)  
[https://polyhaven.com/](https://polyhaven.com/)

