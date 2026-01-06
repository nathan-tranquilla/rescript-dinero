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

# Benchmark Tasks
def benchmark_project(project_name, clean_task, build_task, build_command, directory)
  puts "⏱️  Benchmarking #{project_name} build times..."
  
  times = []
  3.times do |i|
    puts "  Trial #{i + 1}/3..."
    
    # Clean before each trial
    Rake::Task[clean_task].execute
    
    # Time the build
    start_time = Time.now
    Rake::Task[build_task].execute
    end_time = Time.now
    
    build_time = end_time - start_time
    times << build_time
    puts "    #{build_time.round(3)}s"
  end
  
  average = times.sum / times.length
  puts "📊 #{project_name} average build time: #{average.round(3)}s"
  average
end

desc "Benchmark ReScript build time (3 trials, averaged)"
task :bench_rescript => [:build_rescript] do
  benchmark_project("ReScript", :clean_rescript, :build_rescript, "res:build", "rescript")
end

desc "Benchmark TypeScript build time (3 trials, averaged)"
task :bench_typescript => [:build_typescript] do
  benchmark_project("TypeScript", :clean_typescript, :build_typescript, "build", "typescript")
end

desc "Run build time benchmark comparison and declare winner"
task :benchmark => [:build_rescript, :build_typescript] do
  puts "🏁 Starting ReScript vs TypeScript build benchmark..."
  puts "=" * 50
  
  # Run ReScript benchmark
  rescript_time = benchmark_project("ReScript", :clean_rescript, :build_rescript, "res:build", "rescript")
  
  puts "\n" + "=" * 50
  
  # Run TypeScript benchmark  
  typescript_time = benchmark_project("TypeScript", :clean_typescript, :build_typescript, "build", "typescript")
  
  puts "\n" + "=" * 50
  puts "🏆 BENCHMARK RESULTS:"
  puts "  ReScript:   #{rescript_time.round(3)}s"
  puts "  TypeScript: #{typescript_time.round(3)}s"
  
  if rescript_time < typescript_time
    improvement = ((typescript_time - rescript_time) / typescript_time * 100).round(1)
    puts "🥇 WINNER: ReScript (#{improvement}% faster!)"
  elsif typescript_time < rescript_time
    improvement = ((rescript_time - typescript_time) / rescript_time * 100).round(1)
    puts "🥇 WINNER: TypeScript (#{improvement}% faster!)"
  else
    puts "🤝 TIE: Both have identical build times!"
  end
  puts "=" * 50
end
