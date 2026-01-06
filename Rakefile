# Rakefile for managing ReScript vs TypeScript benchmark project

task :default do 
  sh "rake --tasks"
end 

desc "Clean all build artifacts from both projects"
task :clean => [:clean_rescript, :clean_typescript]

desc "Clean ReScript build artifacts"
task :clean_rescript do
  puts "🧹 Cleaning ReScript project..."

  Dir.chdir("rescript") do 
    sh "npm run res:clean"
  end 
  
  # Clean ReScript lib directory
  sh "rm -rf rescript/lib" if Dir.exist?("rescript/lib")
  
  puts "✅ ReScript project cleaned"
end

desc "Clean TypeScript build artifacts"
task :clean_typescript do
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