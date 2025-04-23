import React from "react";
import { Button } from "./ui/button";
import {
  PenLine,
  BookOpen,
  Rocket,
  Users,
  Layout,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-24 pb-32">
        {/* Decorative Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-50 pointer-events-none z-0 animate-fade-in">
          <div className="w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-fade-down animate-duration-700">
              Where Ideas Come to Life
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed animate-fade-up animate-delay-300">
              Join our community of creative minds. Write, share, and connect
              with readers from around the globe on Bloggy's modern blogging
              platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 animate-fade-up animate-delay-500">
              <Button
                size="lg"
                className="text-lg h-12 px-8 hover:bg-primary/90 transition-colors animate-pulse animate-infinite animate-duration-[2000ms]"
                asChild
              >
                <Link to="/writeBlog" className="flex items-center gap-2">
                  <PenLine className="size-5" />
                  Start Writing
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="text-lg h-12 px-8 hover:bg-accent hover:text-accent-foreground transition-colors"
                asChild
              >
                <Link to="/viewBlogs" className="flex items-center gap-2">
                  <BookOpen className="size-5" />
                  Explore Blogs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12 animate-fade-down">
          <h2 className="text-3xl font-bold mb-4">Discover Your Interest</h2>
          <p className="text-muted-foreground">
            Explore content across various categories
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Technology",
              icon: <Rocket className="size-6" />,
              color: "bg-blue-500/10",
              delay: "100",
            },
            {
              name: "Lifestyle",
              icon: <Users className="size-6" />,
              color: "bg-green-500/10",
              delay: "200",
            },
            {
              name: "Travel",
              icon: <Layout className="size-6" />,
              color: "bg-yellow-500/10",
              delay: "300",
            },
            {
              name: "Education",
              icon: <TrendingUp className="size-6" />,
              color: "bg-purple-500/10",
              delay: "400",
            },
          ].map((category) => (
            <Link
              key={category.name}
              to={`/category/${category.name.toLowerCase()}`}
              className={`group rounded-xl p-6 ${category.color} hover:scale-105 transition-transform duration-200 animate-fade-right animate-delay-${category.delay}`}
            >
              <div className="flex items-center gap-4">
                {category.icon}
                <h3 className="text-xl font-semibold">{category.name}</h3>
                <ArrowRight className="size-5 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section with Cards */}
      <div className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-down">
            <h2 className="text-3xl font-bold mb-4">Why Choose Bloggy?</h2>
            <p className="text-muted-foreground">
              Everything you need to create amazing content
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Intuitive Editor",
                description:
                  "Write and format your content with our easy-to-use rich text editor.",
                icon: <PenLine className="size-8" />,
                delay: "100",
              },
              {
                title: "Engaged Community",
                description:
                  "Connect with readers and writers who share your interests.",
                icon: <Users className="size-8" />,
                delay: "200",
              },
              {
                title: "Powerful Analytics",
                description:
                  "Track your content performance with detailed insights and metrics.",
                icon: <TrendingUp className="size-8" />,
                delay: "300",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-background rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow animate-fade-up animate-delay-${feature.delay}`}
              >
                <div className="bg-primary/10 rounded-lg p-3 w-fit mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="bg-primary/5 rounded-2xl p-12 text-center animate-fade-up">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of writers who have already made Bloggy their home
            for creative expression.
          </p>
          <Link to="/writeBlog">
            <Button
              size="lg"
              className="text-lg h-12 px-8 hover:bg-primary/90 transition-colors animate-bounce animate-infinite animate-duration-[2000ms]"
            >
              Get Started <ArrowRight className="size-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
