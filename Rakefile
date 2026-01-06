# Rakefile for managing ReScript vs TypeScript benchmark project

# Helper method to time a single ReScript build
def time_single_rescript_build
  Dir.chdir("rescript") do
    sh "npm run res:clean", :verbose => false
    output = `{ time npm run res:build; } 2>&1`
    
    time = output.match(/real\s+\d+m([\d.]+)s/) ? $1.to_f : nil
    modules = output =~ /Compiled (\d+) modules/ ? $1.to_i : nil
    
    { time: time, modules: modules }
  end
end

# Helper method to time a single TypeScript build
def time_single_typescript_build
  Dir.chdir("typescript") do
    sh "npm run clean", :verbose => false
    output = `{ time npm run build; } 2>&1`
    
    time = output.match(/real\s+\d+m([\d.]+)s/) ? $1.to_f : nil
    
    { time: time }
  end
end

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
task :time_rescript => [:rs_install] do
  result = time_single_rescript_build
  
  if result[:time] && result[:modules]
    puts "\nReScript - Real Time: #{result[:time]}s | Compiled Modules: #{result[:modules]}"
  else
    puts "\nReScript build failed or could not parse results"
  end
end

desc "Time a TypeScript build and capture metrics"
task :time_typescript => [:ts_install] do
  result = time_single_typescript_build
  
  if result[:time]
    puts "\nTypeScript - Real Time: #{result[:time]}s"
  else
    puts "\nTypeScript build failed or could not parse results"
  end
end

desc "Average 3 ReScript builds"
task :average_rescript => [:rs_install] do
  puts "🔄 Running 3 ReScript builds..."
  times = []
  modules = []
  
  3.times do |i|
    print "Build #{i+1}/3... "
    
    result = time_single_rescript_build
    
    if result[:time]
      times << result[:time]
      modules << result[:modules] if result[:modules]
      puts "#{result[:time]}s"
    else
      puts "failed"
    end
  end
  
  if times.length > 0
    avg_time = times.sum / times.length
    avg_modules = modules.length > 0 ? modules.sum / modules.length : "unknown"
    puts "\nReScript Build Benchmark: Builds: 3, Times: #{times.map{|t| "#{t}s"}.join(",")}, Average Time: #{avg_time.round(3)}s, Average Modules: #{avg_modules}"
  end
end

desc "Average 3 TypeScript builds"
task :average_typescript => [:ts_install] do
  puts "🔄 Running 3 TypeScript builds..."
  times = []
  
  3.times do |i|
    print "Build #{i+1}/3... "
    
    result = time_single_typescript_build
    
    if result[:time]
      times << result[:time]
      puts "#{result[:time]}s"
    else
      puts "failed"
    end
  end
  
  if times.length > 0
    avg_time = times.sum / times.length
    puts "\nTypeScript Build Benchmark: Builds: 3, Times: #{times.map{|t| "#{t}s"}.join(",")}, Average Time: #{avg_time.round(3)}s"
  end
end
