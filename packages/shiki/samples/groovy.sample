import org.mortbay.jetty.Server
import org.mortbay.jetty.servlet.*
import groovy.servlet.*

@Grab(group='org.mortbay.jetty', module='jetty-embedded', version='6.1.14')
def startJetty() {
    def jetty = new Server(9090)
    def context = new Context(jetty, '/', Context.SESSIONS)
    context.setWelcomeFiles(["webserverIndex.groovy"] as String[])
    context.resourceBase = '.'
    context.addServlet(GroovyServlet, '*.groovy')
    jetty.start()
}

println "Starting Jetty on port 9090, press Ctrl+C to stop."
startJetty()

// From https://gist.github.com/saltnlight5/3756240
