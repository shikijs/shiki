global css body m:0 p:0 rd:lg bg:yellow1 of:hidden
tag value-picker
	css w:100px h:40px pos:rel
		d:hgrid ji:center ai:center
	css .item h:100% pos:rel tween:styles 0.1s ease-out

	def update e
		data = options[e.x]

	<self @touch.stop.fit(0,options.length - 1,1)=update>
		for item in options
			<div.item[$value:{item}] .sel=(item==data)>

tag stroke-picker < value-picker
	css .item bg:black w:calc($value*1px) h:40% rd:sm
		o:0.3 @hover:0.8 .sel:1

tag color-picker < value-picker
	css .item js:stretch rdt:lg bg:$value mx:2px scale-y.sel:1.5

tag app-canvas
	prop dpr = window.devicePixelRatio
	prop state = {}

	def draw e
		let path = e.#path ||= new Path2D
		let ctx = $canvas.getContext('2d')
		path.lineTo(e.x * dpr,e.y * dpr)
		ctx.lineWidth = state.stroke * dpr
		ctx.strokeStyle = state.color
		ctx.stroke(path)
	
	def resized e
		$canvas.width = offsetWidth * dpr
		$canvas.height = offsetHeight * dpr

	<self @resize=resized @touch.prevent.moved.fit(self)=draw>
		<canvas$canvas[pos:abs w:100% h:100%]>

const strokes = [1,2,3,5,8,12]
const colors = ['#F59E0B','#10B981','#3B82F6','#8B5CF6']
const state = {stroke: 5, color: '#3B82F6'}

tag App
	<self>
		<div[ta:center pt:20 o:0.2 fs:xl]> 'draw here'
		<app-canvas[pos:abs inset:0] state=state>
		<div.tools[pos:abs b:0 w:100% d:hgrid ja:center]>
			<stroke-picker options=strokes bind=state.stroke>
			<color-picker options=colors bind=state.color>

imba.mount <App[pos:abs inset:0]>

# from https://imba.io
# run online at https://scrimba.com/scrim/cPPdD4Aq 