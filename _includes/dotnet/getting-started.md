# Getting Started

The Parse platform provides a complete backend solution for your mobile application. Our goal is to totally eliminate the need for writing server code or maintaining servers.

If you're familiar with web frameworks like ASP.NET MVC we've taken many of the same principles and applied them to our platform. In particular, our SDK is ready to use out of the box with minimal configuration on your part.

<div class='tip info'><div>
  This guide is for the .NET-based version of our SDK. If you are doing Windows 8 development using HTML and JavaScript, please see our <a href="{{ site.baseurl }}/js/guide">JavaScript guide</a>.
</div></div>

If you haven't installed the SDK yet, please [head over to the QuickStart guide]({{ page.quickstart }}) to get our SDK up and running in Visual Studio or Xamarin Studio. Note that our SDK requires Visual Studio 2012 or Xamarin Studio and targets .NET 4.5 applications, Windows Store apps, Windows Phone 8 apps, and [Xamarin.iOS 6.3+](http://docs.xamarin.com/releases/ios/xamarin.ios_6/xamarin.ios_6.3) or [Xamarin.Android 4.7+](http://docs.xamarin.com/releases/android/xamarin.android_4/xamarin.android_4.7) apps. You can also check out our [API Reference]({{ site.apis.dotnet }}) for more detailed information about our SDK.

Parse's .NET SDK makes heavy use of the [Task-based Asynchronous Pattern](http://msdn.microsoft.com/en-us/library/hh873175.aspx) so that your apps remain responsive. You can use the [async and await](http://msdn.microsoft.com/en-us/library/hh191443.aspx) keywords in C# and Visual Basic to easily use these long-running tasks.
