extends Node
class_name TestClass2
@icon("res://path/to/icon.png")

# ******************************************************************************

@export var x : int
@export var y : int
@export var z : String
@export_node_path(Resource) var resource_name

var array_a: Array[int] = [1, 2, 3]
var array_b: Array[String] = ['1', '2', '3']

@rpc
func remote_function_a():
	pass

@rpc(any_peer, call_local, unreliable)
func remote_function_b():
	pass

# ------------------------------------------------------------------------------

func f():
    await $Button.button_up
    super()
    super.some_function()

    for i in range(1): # `in` is a control keyword
        print(i in range(1)) # `in` is an operator keyword

func lambda_test():
	var lambda_a = func(param1, param2, param3):
		pass
	var lambda_b = func(param1, param2=func_a(10, 1.0, 'test')):
		pass
	var lambda_c = func(param1 = false, param2: bool = false, param3 := false):
		pass

	lambda_a.call()
	lambda_b.call()
	lambda_c.call()

# ------------------------------------------------------------------------------

signal changed(new_value)
var warns_when_changed = "some value":
	get:
		return warns_when_changed
	set(value):
		changed.emit(value)
		warns_when_changed = value

# ------------------------------------------------------------------------------

# from https://github.com/godotengine/godot-vscode-plugin/blob/cdc550a412dfffd26dfe7351e429b73c819d68d0/syntaxes/examples/gdscript2.gd