cmake_minimum_required(VERSION 3.0)
project(Happy_DB)

set(CMAKE_CXX_FLAGS "-std=c++11 -levent -lpthread ${CMAKE_CXX_FLAGS}")

set(SOURCE_FILES Source/echoserver_threaded.c Source/main.cpp Source/workqueue.c)
add_executable(Happy_DB ${SOURCE_FILES} Source/Server.cpp Source/Server.h)
target_link_libraries(Happy_DB event)
target_link_libraries(Happy_DB pthread)
