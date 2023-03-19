package com.example.kotlin

import java.util.Random as Rand
import android.support.v7.app.AppCompatActivity
import org.amshove.kluent.`should equal` as Type

fun main(@NonNull args: Array<String>) {
    println("Hello Kotlin! ${/*test*/}")

    val map = mutableMapOf("A" to "B")

    thing.apply("random string here \n\t\r")
    thing.let { test: ->    }

    val string = "${getThing()}"
}

val items = listOf("apple", "banana", "kiwifruit")
var x = 9
const val CONSTANT = 99

@get:Rule
val activityRule = ActivityTestRule(SplashActivity::class.java)

val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val float = 0.043_331F
val bytes = 0b11010010_01101001_10010100_10010010

if(test == "") {
    1 and 2 not 3
} else {
    
}

fun <T> foo() {
    val x  = Bar::class
    val y = hello?.test
}

suspend fun <T, U> SequenceBuilder<Int>.yieldIfOdd(x: Int) {
    if (x % 2 != 0) yield(x)
}

val function = fun(@Inject x: Int, y: Int, lamda: (A, B) -> Unit): Int {
    test.test()
    return x + y;
}

abstract fun onCreate(savedInstanceState: Bundle?)

fun isOdd(x: Int) = x % 2 != 0
fun isOdd(s: String) = s == "brillig" || s == "slithy" || s == "tove"

val numbers = listOf(1, 2, 3)
println(numbers.filter(::isOdd))

fun foo(node: Node?): String? {
    val parent = node.getParent() ?: return null
}

interface Greetable {
    fun greet()
}

open class Greeter: Greetable {
    companion object {
        private const val GREETING = "Hello, World!"
    }
    
    override fun greet() {
        println(GREETING)
    }
}

expect class Foo(bar: String) {
    fun frob() 
}

actual class Foo actual constructor(val bar: String) {
    actual fun frob() {
        println("Frobbing the $bar")
    }
}

expect fun formatString(source: String, vararg args: Any): String
expect annotation class Test

actual fun formatString(source: String, vararg args: Any) = String.format(source, args)
actual typealias Test = org.junit.Test

sealed class Expr
data class Const(val number: Double) : Expr()
data class Sum(val e1: Expr, val e2: Expr) : Expr()
object NotANumber : Expr()

@file:JvmName("Foo")
private sealed class InjectedClass<T, U> @Inject constructor(
    val test: Int = 50, 
    var anotherVar: String = "hello world"
) : SomeSuperClass(test, anotherVar) {

    init {
        //
    }

    constructor(param1: String, param2: Int): this(param1, param2) {
        //
    }

    companion object {
        //
    }
}
annotation class Suspendable
val f = @Suspendable { Fiber.sleep(10) }


private data class Foo(
    /**
     * ```
     * ($)
     * ```
     */
    val variables: Map<String, String>
)

data class Response(@SerializedName("param1") val param1: String,
                    @SerializedName("param2") val param2: String,
                    @SerializedName("param3") val param3: String) {
}

object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { }

    override fun mouseEntered(e: MouseEvent) { }
}

class Feature : Node("Title", "Content", "Description") {

}

class Outer {
    inner class Inner {}
}

// From: https://github.com/nishtahir/language-kotlin/blob/master/snapshots/corpus.kt