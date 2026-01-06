# Rakefile for managing ReScript vs TypeScript benchmark project

# Constants
BUILD_TRIALS = 5

# Helper method to time a single ReScript build
def time_single_rescript_build
  Dir.chdir("rescript") do
    start_time = Time.now
    output = `npm run res:build 2>&1`
    end_time = Time.now
    
    time = (end_time - start_time).round(3)
    modules = output =~ /Compiled (\d+) modules/ ? $1.to_i : nil
    
    { time: time, modules: modules }
  end
end

# Helper method to time a single TypeScript build
def time_single_typescript_build
  Dir.chdir("typescript") do
    start_time = Time.now
    output = `npm run build 2>&1`
    end_time = Time.now
    
    time = (end_time - start_time).round(3)
    
    { time: time }
  end
end

# Benchmark functions
def benchmark_rescript_clean_build_func(quiet: false)
  times = []
  modules = []
  
  BUILD_TRIALS.times do |i|
    
    Rake::Task[:clean_rescript].reenable
    Rake::Task[:clean_rescript].invoke
    result = time_single_rescript_build
    
    if result[:time]
      times << result[:time]
      modules << result[:modules] if result[:modules]
    else
      puts "failed"
    end
  end
  
  if times.length > 0
    avg_time = times.sum / times.length
    avg_modules = modules.length > 0 ? modules.sum / modules.length : "unknown"
    { avg_time: avg_time.round(3), trials: BUILD_TRIALS, avg_modules: avg_modules, times: times }
  else
    { avg_time: nil, trials: 0, avg_modules: nil, times: [] }
  end
end

def benchmark_typescript_clean_build_func(quiet: false)
  times = []
  
  BUILD_TRIALS.times do |i|
    
    Rake::Task[:clean_typescript].reenable
    Rake::Task[:clean_typescript].invoke
    result = time_single_typescript_build
    
    if result[:time]
      times << result[:time]
    else
      puts "failed"
    end
  end
  
  if times.length > 0
    avg_time = times.sum / times.length
    { avg_time: avg_time.round(3), trials: BUILD_TRIALS, times: times }
  else
    { avg_time: nil, trials: 0, times: [] }
  end
end

def benchmark_rescript_incremental_build_func()
  
  times = []
  modules = []
  
  BUILD_TRIALS.times do |i|
    
    # Make a small edit to Sign.res (leaf file) before timing
    sign_file = "rescript/src/utils/Sign.res"
    original_content = File.read(sign_file)

    sleep(1)
    
    # Add a temporary function to trigger recompilation
    timestamp = Time.now.to_f
    modified_content = original_content + "\n\n// Temporary function added for incremental build test\nlet tempFunction#{timestamp.to_i} = (x) => x + 1\n"
    
    File.write(sign_file, modified_content)
    
    # Use the timing task which handles chdir
    result = time_single_rescript_build
    
    # Restore original content
    File.write(sign_file, original_content)
    
    if result[:time]
      times << result[:time]
      modules << result[:modules] if result[:modules]
    else
      puts "failed"
    end
  end
  
  if times.length > 0
    avg_time = times.sum / times.length
    avg_modules = modules.length > 0 ? modules.sum / modules.length : "unknown"
    { avg_time: avg_time.round(3), trials: BUILD_TRIALS, avg_modules: avg_modules, times: times }
  else
    { avg_time: nil, trials: 0, avg_modules: nil, times: [] }
  end
end

def benchmark_typescript_incremental_build_func()
  
  times = []
  
  BUILD_TRIALS.times do |i|
    
    # Make a small edit to sign.ts (leaf file) before timing
    sign_file = "typescript/src/utils/sign.ts"
    original_content = File.read(sign_file)

    sleep(1)
    
    # Add a temporary function to trigger recompilation
    timestamp = Time.now.to_f
    modified_content = original_content + "\n\n// Temporary function added for incremental build test\nexport const tempFunction#{timestamp.to_i} = (x: number): number => x + 1;\n"
    
    File.write(sign_file, modified_content)
    
    # Use the timing task which handles chdir
    result = time_single_typescript_build
    
    # Restore original content
    File.write(sign_file, original_content)
    
    if result[:time]
      times << result[:time]
    else
      puts "failed"
    end
  end
  
  if times.length > 0
    avg_time = times.sum / times.length
    puts "\nTypeScript Incremental Benchmark: Builds: #{BUILD_TRIALS}, Times: #{times.map{|t| "#{t}s"}.join(",")}, Average Time: #{avg_time.round(3)}s"
    { avg_time: avg_time.round(3), trials: BUILD_TRIALS, times: times }
  else
    { avg_time: nil, trials: 0, times: [] }
  end
end

task :default do 
  sh "rake --tasks"
end 

# Install Tasks
desc "Install ReScript project dependencies"
task :rs_install do
  Dir.chdir("rescript") do
    sh "npm install"
  end
end

desc "Install TypeScript project dependencies" 
task :ts_install do
  Dir.chdir("typescript") do
    sh "npm install"
  end
end

desc "Install dependencies for both projects"
task :install => [:rs_install, :ts_install]

desc "Clean all build artifacts from both projects"
task :clean => [:clean_rescript, :clean_typescript]

desc "Clean ReScript build artifacts"
task :clean_rescript => [:rs_install] do

  Dir.chdir("rescript") do 
    sh "npm run res:clean"
  end 
  
  # Clean ReScript lib directory
  sh "rm -rf rescript/lib" if Dir.exist?("rescript/lib")
  
end

desc "Clean TypeScript build artifacts"
task :clean_typescript => [:ts_install] do
  
  Dir.chdir("typescript") do 
    sh "npm run clean"
  end 
end

desc "Clean node_modules from both projects"
task :clean_deps do
  sh "rm -rf rescript/node_modules" if Dir.exist?("rescript/node_modules")
  sh "rm -rf typescript/node_modules" if Dir.exist?("typescript/node_modules")
end

desc "Deep clean - removes all build artifacts and dependencies"
task :clean_all => [:clean, :clean_deps]

# Build Tasks
desc "Build ReScript project"
task :build_rescript => [:rs_install] do
  Dir.chdir("rescript") do
    sh "npm run res:build"
  end
end

desc "Build TypeScript project"  
task :build_typescript => [:ts_install] do
  Dir.chdir("typescript") do
    sh "npm run build"
  end
end

desc "Time a ReScript build and capture metrics"
task :time_rescript => [:rs_install, :clean_rescript] do
  result = time_single_rescript_build
  
  if result[:time] && result[:modules]
    puts "\nReScript - Real Time: #{result[:time]}s | Compiled Modules: #{result[:modules]}"
  else
    puts "\nReScript build failed or could not parse results"
  end
end

desc "Time a TypeScript build and capture metrics"
task :time_typescript => [:ts_install, :clean_typescript] do
  result = time_single_typescript_build
  
  if result[:time]
    puts "\nTypeScript - Real Time: #{result[:time]}s"
  else
    puts "\nTypeScript build failed or could not parse results"
  end
end

desc "Benchmark ReScript clean builds (#{BUILD_TRIALS} trials)"
task :benchmark_rescript_clean_build => [:rs_install] do
  benchmark_rescript_clean_build_func
end

desc "Benchmark TypeScript clean builds (#{BUILD_TRIALS} trials)"
task :benchmark_typescript_clean_build => [:ts_install] do
  benchmark_typescript_clean_build_func
end

desc "Benchmark ReScript incremental builds (#{BUILD_TRIALS} trials)"
task :benchmark_rescript_incremental_build => [:rs_install, :clean_rescript, :build_rescript] do
  benchmark_rescript_incremental_build_func
end

desc "Benchmark TypeScript incremental builds (#{BUILD_TRIALS} trials)"
task :benchmark_typescript_incremental_build => [:ts_install, :clean_typescript, :build_typescript] do
  benchmark_typescript_incremental_build_func
end

desc "Run comprehensive benchmark suite - all build performance tests"
task :benchmark do
  # Run all benchmarks quietly
  rs_clean = benchmark_rescript_clean_build_func()
  ts_clean = benchmark_typescript_clean_build_func()
  rs_inc = benchmark_rescript_incremental_build_func()
  ts_inc = benchmark_typescript_incremental_build_func()
  
  puts "\n" + "=" * 60
  puts "BENCHMARK SUMMARY"
  puts "=" * 60
  puts "Clean Builds:"
  puts "   ReScript:  #{rs_clean[:avg_time]}s avg (#{rs_clean[:trials]} trials, #{rs_clean[:avg_modules]} modules)"
  puts "   TypeScript: #{ts_clean[:avg_time]}s avg (#{ts_clean[:trials]} trials)"
  
  puts "\nIncremental Builds:"
  puts "   ReScript:  #{rs_inc[:avg_time]}s avg (#{rs_inc[:trials]} trials, #{rs_inc[:avg_modules]} modules)"
  puts "   TypeScript: #{ts_inc[:avg_time]}s avg (#{ts_inc[:trials]} trials)"
  
  # Calculate incremental build savings
  puts "\nIncremental Savings vs Clean Builds:"
  if rs_clean[:avg_time] && rs_inc[:avg_time]
    rs_saved = (rs_clean[:avg_time] - rs_inc[:avg_time]).round(3)
    rs_saved_percent = ((rs_saved / rs_clean[:avg_time]) * 100).round(1)
    puts "   ReScript:  #{rs_saved}s (#{rs_saved_percent}% faster)"
  end
  
  if ts_clean[:avg_time] && ts_inc[:avg_time]
    ts_saved = (ts_clean[:avg_time] - ts_inc[:avg_time]).round(3)
    ts_saved_percent = ((ts_saved / ts_clean[:avg_time]) * 100).round(1)
    puts "   TypeScript: #{ts_saved}s (#{ts_saved_percent}% faster)"
  end
  
  if rs_clean[:avg_time] && ts_clean[:avg_time]
    clean_winner = rs_clean[:avg_time] < ts_clean[:avg_time] ? "ReScript" : "TypeScript"
    clean_loser_time = rs_clean[:avg_time] < ts_clean[:avg_time] ? ts_clean[:avg_time] : rs_clean[:avg_time]
    clean_winner_time = rs_clean[:avg_time] < ts_clean[:avg_time] ? rs_clean[:avg_time] : ts_clean[:avg_time]
    clean_diff = (clean_loser_time - clean_winner_time).round(3)
    clean_percent = ((clean_diff / clean_loser_time) * 100).round(1)
    puts "\nClean Build Winner: #{clean_winner} (#{clean_diff}s faster, #{clean_percent}% improvement)"
  end
  
  if rs_inc[:avg_time] && ts_inc[:avg_time]
    inc_winner = rs_inc[:avg_time] < ts_inc[:avg_time] ? "ReScript" : "TypeScript"
    inc_loser_time = rs_inc[:avg_time] < ts_inc[:avg_time] ? ts_inc[:avg_time] : rs_inc[:avg_time]
    inc_winner_time = rs_inc[:avg_time] < ts_inc[:avg_time] ? rs_inc[:avg_time] : ts_inc[:avg_time]
    inc_diff = (inc_loser_time - inc_winner_time).round(3)
    inc_percent = ((inc_diff / inc_loser_time) * 100).round(1)
    puts "\nIncremental Build Winner: #{inc_winner} (#{inc_diff}s faster, #{inc_percent}% improvement)"
  end
  
  puts "\n" + "=" * 60
end
