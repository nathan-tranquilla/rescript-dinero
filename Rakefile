# Rakefile for managing ReScript vs TypeScript benchmark project

task :default do 
  sh "rake --tasks"
end 

# Install Tasks
desc "Install ReScript project dependencies"
task :rs_install do
  puts "📦 Installing ReScript dependencies..."
  Dir.chdir("rescript") do
    sh "npm install"
  end
  puts "✅ ReScript dependencies installed"
end

desc "Install TypeScript project dependencies" 
task :ts_install do
  puts "📦 Installing TypeScript dependencies..."
  Dir.chdir("typescript") do
    sh "npm install"
  end
  puts "✅ TypeScript dependencies installed"
end

desc "Install dependencies for both projects"
task :install => [:rs_install, :ts_install]

desc "Clean all build artifacts from both projects"
task :clean => [:clean_rescript, :clean_typescript]

desc "Clean ReScript build artifacts"
task :clean_rescript => [:rs_install] do
  puts "🧹 Cleaning ReScript project..."

  Dir.chdir("rescript") do 
    sh "npm run res:clean"
  end 
  
  # Clean ReScript lib directory
  sh "rm -rf rescript/lib" if Dir.exist?("rescript/lib")
  
  puts "✅ ReScript project cleaned"
end

desc "Clean TypeScript build artifacts"
task :clean_typescript => [:ts_install] do
  puts "🧹 Cleaning TypeScript project..."
  
  Dir.chdir("typescript") do 
    sh "npm run clean"
  end 
  
  puts "✅ TypeScript project cleaned"
end

desc "Clean node_modules from both projects"
task :clean_deps do
  puts "🧹 Cleaning node_modules..."
  
  sh "rm -rf rescript/node_modules" if Dir.exist?("rescript/node_modules")
  sh "rm -rf typescript/node_modules" if Dir.exist?("typescript/node_modules")
  
  puts "✅ Dependencies cleaned"
end

desc "Deep clean - removes all build artifacts and dependencies"
task :clean_all => [:clean, :clean_deps]

# Build Tasks
desc "Build ReScript project"
task :build_rescript => [:rs_install] do
  puts "🔨 Building ReScript project..."
  Dir.chdir("rescript") do
    sh "npm run res:build"
  end
  puts "✅ ReScript build complete"
end

desc "Build TypeScript project"  
task :build_typescript => [:ts_install] do
  puts "🔨 Building TypeScript project..."
  Dir.chdir("typescript") do
    sh "npm run build"
  end
  puts "✅ TypeScript build complete"
end

desc "Time a ReScript build and capture metrics"
task :time_rescript => [:rs_install, :clean_rescript] do
  Dir.chdir("rescript") do
    # Capture both stdout and stderr including time output
    output = `{ time npm run res:build; } 2>&1`
    # puts output
    
    # Parse real time and compiled modules
    if match = output.match(/real\s+\d+m([\d.]+)s/)
      real_time = match[1].to_f
    else
      real_time = "unknown"
    end
    
    module_count = output =~ /Compiled (\d+) modules/ ? $1.to_i : "unknown"
    
    puts "\nReScript - Real Time: #{real_time}s | Compiled Modules: #{module_count}"
  end
end

desc "Time a TypeScript build and capture metrics"
task :time_typescript => [:ts_install, :clean_typescript] do
  Dir.chdir("typescript") do
    # Capture both stdout and stderr including time output
    output = `{ time npm run build; } 2>&1`
    # puts output
    
    # Parse real time and compiled files
    if match = output.match(/real\s+\d+m([\d.]+)s/)
      real_time = match[1].to_f
    else
      real_time = "unknown"
    end
    
    # TypeScript doesn't output module count like ReScript, so count files
    
    puts "\nTypeScript - Real Time: #{real_time}s"
  end
end
