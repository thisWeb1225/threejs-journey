# lights 光
我們之前學習了簡單的添加光源到場景中。 接下來就詳細講講各種各樣的光源、參數以及如何使用。

## AmbientLight 環境光
環境光會均勻的照亮場景中的所有物體。

環境光不能用來投射陰影，因為它沒有方向。

AmbientLight 繼承自 Light，因此具有 Light 的公共屬性: Object3D → Light → AmbientLight

因此在構造函數的聲明變數也可以直接在其示例上修改，如下
```ts
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Equals
const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(0xffffff)
ambientLight.intensity = 0.5
scene.add(ambientLight)
```

在現實世界中，如果使用光照射一個物體，物體的背面不是全黑的，這是因為會有牆面或其他物體反光。 但是在 Three.js 中，由於性能問題，沒有反光的特性，所以可以使用微弱的環境光 AmbientLight 來類比這種反光。

## DirectionalLight 平行光
平行光是沿著特定方向發射的光。 這種光的表現像是無限遠，從它發出的光線都是平行的。 常常用平行光來類比太陽光 的效果; 太陽足夠遠，因此我們可以認為太陽的位置是無限遠，所以我們認為從太陽發出的光線也都是平行的。 平行光可以投射陰影。

```ts
const directionalLight = new THREE.DirectionalLight('#ffffaa', 0.5)
scene.add(directionalLight)
```

默認平行光是從頂部直射的，我們可以使用 position 屬性設置位置
```ts
const directionalLight = new THREE.DirectionalLight('#ffffaa', 0.5)
directionalLight.position.set(1, 0.25, 0)
scene.add(directionalLight)
```

可以看到光來自右側。
我們暫時不考慮光線的傳播距離，預設是來自無窮遠，併發散到無窮遠。

## HemisphereLight 半球光
光源直接放置於場景之上，類似環境光 AmbientLight，但光照顏色從天空光線顏色漸變到地面光線顏色。
半球光不能投射陰影。
```ts
const hemisphereLight = new THREE.HemisphereLight('#B71C1C', '#004D40', 0.6)
scene.add(hemisphereLight)
```

## PointLight 點光源
從一個點向各個方向發射的光源。 一個常見的例子是類比一個燈泡發出的光。 該光源可以投射陰影。
其特點是光源無線小，光線向各個方向傳播。

color 是顏色
intensity 是強度。
distance 這個距離表示從光源到光照強度為0的位置。 當設置為0時，光永遠不會消失（距離無窮大）。 預設 0.
decay 沿著光照距離的衰退量。
```ts
PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )

const pointLight = new THREE.PointLight(0xff9000, 0.5)
pointLight.position.set(1, 1, 1)
scene.add(pointLight)
```

## RectAreaLight 平面光光源
平面光光源從一個矩形平面上均勻地發射光線。 這種光源可以用來類比像明亮的窗戶或者條狀燈光光源。 它混合了平行光與發散光。
只支援 MeshStandardMaterial 和 MeshPhysicalMaterial 兩種材質。
```ts
RectAreaLight( color : Integer, intensity : Float, width : Float, height : Float )
```

- color: （可選參數） 十六進位數位表示的光照顏色。 預設 0xffffff （白色）
- intensity: （選擇參數） 光源強度/亮度 。 預設為 1。
- width: （可選參數） 光源寬度。 預設為 10。
- height: （可選參數） 光源高度。 預設為 10。

```ts
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 10, 1, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)
```

## SpotLight 聚光燈
光線從一個點沿一個方向射出，隨著光線照射的變遠，光線圓錐體的尺寸也逐漸增大。 該光源可以投射陰影。
```ts
SpotLight( color : Integer, intensity : Float, distance : Float, angle : Radians, penumbra : Float, decay : Float )
```

- color - （可選參數） 十六進位光照顏色。 預設 0xffffff （白色）。
- intensity - （可選參數） 光照強度。 預設 1。
- distance - 從光源發出光的最大距離，其強度根據光源的距離線性衰減。
- angle - 光線散射角度，最大為Math.PI/2。
- penumbra - 聚光錐的半影衰減百分比。 在0和1之間的值。 預設為0。
- decay - 沿著光照距離的衰減量。

```ts
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)
```

## 性能考慮
光照效果很好，但是會非常消耗性能。 GPU 會對其進行大量計算。
最低成本：
- 環境光 AmbientLight
- 半球光 HemisphereLight

成本適中：
- 平行光 DirectionalLight
- 點光源 PointLight

成本高：
- 聚光燈 SpotLight
- 平面光 RectAreaLight

所以要盡量少的添加燈光，就會帶來更好的性能。 

那如果想要少的燈光，但又想有很好的光效該怎麼辦呢？ 可以考慮Baking光照的方案。

## Baking 烘焙光照
原理是將光照烘焙到貼圖紋理（Texture）中，這個過程可以在 3D 建模軟體中實現。 但不足的是，不能移動光線，因為根本沒有光，是在貼圖紋理中模擬光源的效果。
