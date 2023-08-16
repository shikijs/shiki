Imports System
Imports System.Drawing
Imports System.Windows.Forms

Public Class HelloWindows

   Inherits Form

   Private lblHelloWindows As Label

   Public Shared Sub Main(  )
      Application.Run(New HelloWindows(  ))
   End Sub

   Public Sub New(  )

      lblHelloWindows = New Label(  )
      With lblHelloWindows
         .Location = New Point(37, 31)
         .Size = New Size(392, 64)
         .Font = New Font("Arial", 36)
         .Text = "Hello, Windows!"
         .TabIndex = 0
         .TextAlign = ContentAlignment.TopCenter
      End With

      Me.Text = "Programming Visual Basic .NET"
      AutoScaleBaseSize = New Size(5, 13)
      FormBorderStyle = FormBorderStyle.FixedSingle
      ClientSize = New Size(466, 127)

      Controls.Add(lblHelloWindows)

   End Sub

End Class

' From https://www.oreilly.com/library/view/programming-visual-basic/0596000936/ch01s03.html
