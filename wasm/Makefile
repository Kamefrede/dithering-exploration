# Compiler and flags
EMCC = emcc
CXXFLAGS = -lembind --no-entry -DCMAKE_EXPORT_COMPILE_COMMANDS=1

# Output files
OUTPUT_JS = main.js
OUTPUT_WASM = main.wasm
OUTPUT_DTS = main.d.ts

# Source file
SRC = main.cpp

# Build configurations
OPT_FLAGS_DEBUG = -O0
OPT_FLAGS_RELEASE = -O3

# Common flags for both builds
COMMON_FLAGS = -s MODULARIZE=1 -s EXPORT_ES6=1 -s USE_ES6_IMPORT_META=1 -s ENVIRONMENT='web' -s EXPORTED_FUNCTIONS='["_free","_malloc"]' -s ALLOW_MEMORY_GROWTH=1 -msimd128

# Default target
all: release

# Release build
release:
	$(EMCC) $(SRC) $(CXXFLAGS) $(COMMON_FLAGS) $(OPT_FLAGS_RELEASE) -o $(OUTPUT_JS) --emit-tsd=$(OUTPUT_DTS)

# Debug build (no optimizations)
debug:
	$(EMCC) $(SRC) $(CXXFLAGS) $(COMMON_FLAGS) $(OPT_FLAGS_DEBUG) -o $(OUTPUT_JS) --emit-tsd=$(OUTPUT_DTS)

# Clean the build artifacts
clean:
	rm -f $(OUTPUT_JS) $(OUTPUT_WASM) $(OUTPUT_DTS)

.PHONY: all release debug clean
