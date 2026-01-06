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

def make_random_edit(file_path, file_type)
  content = File.read(file_path)
  
  # Add a random comment and a dummy variable based on file type
  random_id = rand(10000)
  case file_type
  when :rescript
    random_edit = "// Random benchmark edit #{random_id}\nlet _benchmarkVar#{random_id} = #{random_id}\n\n"
  when :typescript  
    random_edit = "// Random benchmark edit #{random_id}\nconst _benchmarkVar#{random_id} = #{random_id};\n\n"
  end
  
  # Insert the edit at the beginning of the file after any existing imports/opens
  lines = content.split("\n")
  insert_index = 0
  
  # Find insertion point after imports/opens
  lines.each_with_index do |line, i|
    if file_type == :rescript && (line.strip.start_with?("open ") || line.strip.start_with?("//"))
      insert_index = i + 1
    elsif file_type == :typescript && (line.strip.start_with?("import ") || line.strip.start_with?("//"))
      insert_index = i + 1
    elsif line.strip.empty?
      insert_index = i + 1
    else
      break
    end
  end
  
  lines.insert(insert_index, random_edit)
  new_content = lines.join("\n")
  File.write(file_path, new_content)
  puts "    Added random variable to #{File.basename(file_path)}"
end

def get_random_source_file(directory, file_pattern)
  files = Dir.glob("#{directory}/#{file_pattern}")
  # Filter out test files and demo files
  files = files.reject { |f| f.include?("test") || f.include?("Test") || f.include?("Demo") }
  files.sample # Return a random file
end

def benchmark_incremental(project_name, build_task, file_type, directory)
  puts "⏱️  Benchmarking #{project_name} incremental build times..."
  
  times = []
  3.times do |i|
    puts "  Trial #{i + 1}/3..."
    
    # Pick a random source file for each trial
    case file_type
    when :rescript
      edit_file = get_random_source_file(directory, "src/**/*.res")
    when :typescript
      edit_file = get_random_source_file(directory, "src/**/*.ts")
    end
    
    if edit_file && File.exist?(edit_file)
      puts "    Editing #{File.basename(edit_file)}"
      # Make a random edit
      make_random_edit(edit_file, file_type)
      
      # Time the incremental build
      start_time = Time.now
      Rake::Task[build_task].execute
      end_time = Time.now
      
      build_time = end_time - start_time
      times << build_time
      puts "    #{build_time.round(3)}s"
      
      # Clean up the random edit
      sh "git checkout -- #{edit_file}" rescue nil
    else
      puts "    Warning: No suitable source file found for editing"
      times << 0.0
    end
  end
  
  average = times.sum / times.length
  puts "📊 #{project_name} average incremental build time: #{average.round(3)}s"
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

desc "Benchmark ReScript incremental build time (3 trials, averaged)"
task :bench_rescript_incremental => [:build_rescript] do
  benchmark_incremental("ReScript", :build_rescript, :rescript, "rescript")
end

desc "Benchmark TypeScript incremental build time (3 trials, averaged)"
task :bench_typescript_incremental => [:build_typescript] do
  benchmark_incremental("TypeScript", :build_typescript, :typescript, "typescript")
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

desc "Run incremental build benchmark comparison"
task :benchmark_incremental => [:build_rescript, :build_typescript] do
  puts "🏁 Starting ReScript vs TypeScript incremental build benchmark..."
  puts "=" * 50
  
  # Run ReScript incremental benchmark
  rescript_incr_time = benchmark_incremental("ReScript", :build_rescript, :rescript, "rescript")
  
  puts "\n" + "=" * 50
  
  # Run TypeScript incremental benchmark  
  typescript_incr_time = benchmark_incremental("TypeScript", :build_typescript, :typescript, "typescript")
  
  puts "\n" + "=" * 50
  puts "🏆 INCREMENTAL BUILD RESULTS:"
  puts "  ReScript:   #{rescript_incr_time.round(3)}s"
  puts "  TypeScript: #{typescript_incr_time.round(3)}s"
  
  if rescript_incr_time < typescript_incr_time
    improvement = ((typescript_incr_time - rescript_incr_time) / typescript_incr_time * 100).round(1)
    puts "🥇 WINNER: ReScript (#{improvement}% faster!)"
  elsif typescript_incr_time < rescript_incr_time
    improvement = ((rescript_incr_time - typescript_incr_time) / rescript_incr_time * 100).round(1)
    puts "🥇 WINNER: TypeScript (#{improvement}% faster!)"
  else
    puts "🤝 TIE: Both have identical incremental build times!"
  end
  puts "=" * 50
end

desc "Run comprehensive benchmark (both clean and incremental builds)"
task :benchmark_all => [:build_rescript, :build_typescript] do
  puts "🏁 Starting comprehensive ReScript vs TypeScript benchmark..."
  puts "=" * 60
  puts "CLEAN BUILDS:"
  puts "=" * 60
  
  # Clean build benchmarks
  rescript_time = benchmark_project("ReScript", :clean_rescript, :build_rescript, "res:build", "rescript")
  puts "\n" + "=" * 30
  typescript_time = benchmark_project("TypeScript", :clean_typescript, :build_typescript, "build", "typescript")
  
  puts "\n" + "=" * 60
  puts "INCREMENTAL BUILDS:"
  puts "=" * 60
  
  # Incremental build benchmarks
  rescript_incr_time = benchmark_incremental("ReScript", :build_rescript, :rescript, "rescript")
  puts "\n" + "=" * 30
  typescript_incr_time = benchmark_incremental("TypeScript", :build_typescript, :typescript, "typescript")
  
  puts "\n" + "=" * 60
  puts "🏆 COMPREHENSIVE BENCHMARK RESULTS:"
  puts "=" * 60
  puts "Clean Builds:"
  puts "  ReScript:   #{rescript_time.round(3)}s"
  puts "  TypeScript: #{typescript_time.round(3)}s"
  
  if rescript_time < typescript_time
    improvement = ((typescript_time - rescript_time) / typescript_time * 100).round(1)
    puts "  🥇 Clean Winner: ReScript (#{improvement}% faster!)"
  elsif typescript_time < rescript_time
    improvement = ((rescript_time - typescript_time) / rescript_time * 100).round(1)
    puts "  🥇 Clean Winner: TypeScript (#{improvement}% faster!)"
  else
    puts "  🤝 Clean Tie: Both have identical build times!"
  end
  
  puts "\nIncremental Builds:"
  puts "  ReScript:   #{rescript_incr_time.round(3)}s"
  puts "  TypeScript: #{typescript_incr_time.round(3)}s"
  
  if rescript_incr_time < typescript_incr_time
    improvement = ((typescript_incr_time - rescript_incr_time) / typescript_incr_time * 100).round(1)
    puts "  🥇 Incremental Winner: ReScript (#{improvement}% faster!)"
  elsif typescript_incr_time < rescript_incr_time
    improvement = ((rescript_incr_time - typescript_incr_time) / rescript_incr_time * 100).round(1)
    puts "  🥇 Incremental Winner: TypeScript (#{improvement}% faster!)"
  else
    puts "  🤝 Incremental Tie: Both have identical incremental build times!"
  end
  puts "=" * 60
end
